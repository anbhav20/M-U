import { useState, useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { 
  ConnectionStatusType, 
  ConnectionStatus, 
  ChatType,
  ConnectionPreferenceType,
  WebRTCSignal 
} from '@shared/schema';

interface UseVideoChatProps {
  matchPreference: ConnectionPreferenceType;
}

export default function useVideoChat({ matchPreference }: UseVideoChatProps) {
  const [status, setStatus] = useState<ConnectionStatusType>(ConnectionStatus.Disconnected);
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const remoteStreamRef = useRef<HTMLVideoElement>(null);
  const localMediaStreamRef = useRef<MediaStream | null>(null);
  
  // Setup media stream and WebRTC
  useEffect(() => {
    let localStream: MediaStream;

    const initVideoCall = async () => {
      try {
        // Get user media
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        // Store reference to the stream
        localMediaStreamRef.current = localStream;
        
        // Set local video source
        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
        }

        // Initialize socket connection
        const socket = io('/video', { 
          path: '/api/socket.io',
          query: {
            preference: matchPreference,
            chatType: ChatType.Video
          }
        });
        
        socketRef.current = socket;

        // Socket event listeners
        socket.on('connect', () => {
          setStatus(ConnectionStatus.Waiting);
          setError(null);
        });

        socket.on('disconnect', () => {
          cleanupRTCConnection();
          setStatus(ConnectionStatus.Disconnected);
        });

        socket.on('connect_error', (err) => {
          setError(`Connection error: ${err.message}`);
          setStatus(ConnectionStatus.Disconnected);
        });

        socket.on('matched', async (isCaller: boolean) => {
          setStatus(ConnectionStatus.Connected);
          
          // Create and configure RTCPeerConnection
          createPeerConnection();
          
          if (isCaller) {
            await createAndSendOffer();
          }
        });

        socket.on('signal', async (signal: WebRTCSignal) => {
          try {
            if (!peerConnectionRef.current) {
              createPeerConnection();
            }
            
            if (signal.type === 'offer') {
              await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription({
                type: 'offer',
                sdp: signal.sdp
              }));
              
              const answer = await peerConnectionRef.current!.createAnswer();
              await peerConnectionRef.current!.setLocalDescription(answer);
              
              socketRef.current!.emit('signal', {
                type: 'answer',
                sdp: answer.sdp
              });
            } 
            else if (signal.type === 'answer') {
              await peerConnectionRef.current!.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: signal.sdp
              }));
            } 
            else if (signal.type === 'candidate') {
              await peerConnectionRef.current!.addIceCandidate(signal.candidate!);
            }
          } catch (err) {
            console.error('Error handling WebRTC signal:', err);
            setError('WebRTC connection failed');
          }
        });

        socket.on('strangerDisconnected', () => {
          if (remoteStreamRef.current) {
            remoteStreamRef.current.srcObject = null;
          }
          cleanupRTCConnection();
          setStatus(ConnectionStatus.Waiting);
        });

        socket.on('error', (message: string) => {
          setError(message);
        });
      } catch (err) {
        console.error('Error initializing video chat:', err);
        setError('Failed to access camera or microphone');
      }
    };

    initVideoCall();

    // Cleanup function
    return () => {
      if (localMediaStreamRef.current) {
        localMediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      
      cleanupRTCConnection();
      
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [matchPreference]);

  // Create peer connection
  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };
    
    const pc = new RTCPeerConnection(configuration);
    
    // Add local tracks to connection
    if (localMediaStreamRef.current) {
      localMediaStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localMediaStreamRef.current!);
      });
    }
    
    // Handle ICE candidates
    pc.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current?.emit('signal', {
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };
    
    // Handle connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        cleanupRTCConnection();
      }
    };
    
    // Handle receiving remote tracks
    pc.ontrack = event => {
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = event.streams[0];
      }
    };
    
    peerConnectionRef.current = pc;
  };

  // Create and send WebRTC offer
  const createAndSendOffer = async () => {
    try {
      if (!peerConnectionRef.current) return;
      
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);
      
      socketRef.current?.emit('signal', {
        type: 'offer',
        sdp: offer.sdp
      });
    } catch (err) {
      console.error('Error creating offer:', err);
      setError('Failed to create WebRTC offer');
    }
  };

  // Clean up WebRTC connection
  const cleanupRTCConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  // Toggle microphone
  const toggleMicrophone = useCallback(() => {
    if (localMediaStreamRef.current) {
      const audioTracks = localMediaStreamRef.current.getAudioTracks();
      
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsMicOn(audioTracks[0]?.enabled ?? false);
    }
  }, []);

  // Toggle camera
  const toggleCamera = useCallback(() => {
    if (localMediaStreamRef.current) {
      const videoTracks = localMediaStreamRef.current.getVideoTracks();
      
      videoTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      
      setIsCameraOn(videoTracks[0]?.enabled ?? false);
    }
  }, []);

  // Find next stranger
  const findNextStranger = useCallback(() => {
    if (socketRef.current) {
      // Clean up current connection
      if (remoteStreamRef.current) {
        remoteStreamRef.current.srcObject = null;
      }
      
      cleanupRTCConnection();
      
      // Request next match
      socketRef.current.emit('next');
      setStatus(ConnectionStatus.Waiting);
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(() => {
    if (localMediaStreamRef.current) {
      localMediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    cleanupRTCConnection();
    
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    
    setStatus(ConnectionStatus.Disconnected);
  }, []);

  return {
    status,
    localStreamRef,
    remoteStreamRef,
    isMicOn,
    isCameraOn,
    toggleMicrophone,
    toggleCamera,
    findNextStranger,
    disconnect,
    error
  };
}
