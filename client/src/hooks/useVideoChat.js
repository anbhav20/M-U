import { useState, useEffect, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import {  
  ConnectionStatus, 
  ChatType,
} from '@shared/schema';

export default function useVideoChat({ matchPreference, gender, genderPreference }) {
  const [status, setStatus] = useState(ConnectionStatus.Disconnected);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [error, setError] = useState(null);

  const socketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);
  const localMediaStreamRef = useRef(null);

  useEffect(() => {
    let localStream;

    const initVideoCall = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        localMediaStreamRef.current = localStream;

        if (localStreamRef.current) {
          localStreamRef.current.srcObject = localStream;
        }

        const socket = io('/video', { 
          path: '/api/socket.io',
          query: {
            preference: matchPreference,
            gender: gender,
            genderPreference: genderPreference,
            chatType: ChatType.Video
          }
        });

        socketRef.current = socket;

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

        socket.on('matched', async (isCaller) => {
          setStatus(ConnectionStatus.Connected);
          createPeerConnection();
          if (isCaller) await createAndSendOffer();
        });

        socket.on('signal', async (signal) => {
          try {
            if (!peerConnectionRef.current) createPeerConnection();

            if (signal.type === 'offer') {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                type: 'offer',
                sdp: signal.sdp
              }));

              const answer = await peerConnectionRef.current.createAnswer();
              await peerConnectionRef.current.setLocalDescription(answer);

              socketRef.current.emit('signal', {
                type: 'answer',
                sdp: answer.sdp
              });
            } else if (signal.type === 'answer') {
              await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription({
                type: 'answer',
                sdp: signal.sdp
              }));
            } else if (signal.type === 'candidate') {
              await peerConnectionRef.current.addIceCandidate(signal.candidate);
            }
          } catch (err) {
            console.error('Error handling WebRTC signal:', err);
            setError('WebRTC connection failed');
          }
        });

        socket.on('strangerDisconnected', () => {
          if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;
          cleanupRTCConnection();
          setStatus(ConnectionStatus.Waiting);
        });

        socket.on('error', (message) => {
          setError(message);
        });
      } catch (err) {
        console.error('Error initializing video chat:', err);
        setError('Failed to access camera or microphone');
      }
    };

    initVideoCall();

    return () => {
      if (localMediaStreamRef.current) {
        localMediaStreamRef.current.getTracks().forEach(track => track.stop());
      }
      cleanupRTCConnection();
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [matchPreference, gender, genderPreference]);

  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const pc = new RTCPeerConnection(configuration);

    if (localMediaStreamRef.current) {
      localMediaStreamRef.current.getTracks().forEach(track => {
        pc.addTrack(track, localMediaStreamRef.current);
      });
    }

    pc.onicecandidate = event => {
      if (event.candidate) {
        socketRef.current?.emit('signal', {
          type: 'candidate',
          candidate: event.candidate
        });
      }
    };

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'failed' || pc.connectionState === 'disconnected') {
        cleanupRTCConnection();
      }
    };

    pc.ontrack = event => {
      if (remoteStreamRef.current) remoteStreamRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current = pc;
  };

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

  const cleanupRTCConnection = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
  };

  const toggleMicrophone = useCallback(() => {
    if (localMediaStreamRef.current) {
      const audioTracks = localMediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => track.enabled = !track.enabled);
      setIsMicOn(audioTracks[0]?.enabled ?? false);
    }
  }, []);

  const toggleCamera = useCallback(() => {
    if (localMediaStreamRef.current) {
      const videoTracks = localMediaStreamRef.current.getVideoTracks();
      videoTracks.forEach(track => track.enabled = !track.enabled);
      setIsCameraOn(videoTracks[0]?.enabled ?? false);
    }
  }, []);

  const findNextStranger = useCallback(() => {
    if (socketRef.current) {
      if (remoteStreamRef.current) remoteStreamRef.current.srcObject = null;
      cleanupRTCConnection();
      socketRef.current.emit('next');
      setStatus(ConnectionStatus.Waiting);
    }
  }, []);

  const disconnect = useCallback(() => {
    if (localMediaStreamRef.current) {
      localMediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    cleanupRTCConnection();
    if (socketRef.current) socketRef.current.disconnect();
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
