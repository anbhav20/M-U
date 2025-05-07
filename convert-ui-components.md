# UI Component Conversion Guide

This guide provides instructions for converting UI components from TypeScript (`.tsx`) to JavaScript (`.jsx`).

## General Conversion Rules

1. **Remove Type Annotations**: 
   - Remove all type annotations (`: string`, `: number`, `: boolean`, etc.)
   - Remove interface and type definitions
   - Remove generic type parameters (`<T>`)

2. **Props Destructuring**:
   - Change `function Component({ prop1, prop2 }: ComponentProps)` to `function Component({ prop1, prop2 })`

3. **React Hooks**:
   - Change `useState<string>("")` to `useState("")`
   - Change `useRef<HTMLDivElement>(null)` to `useRef(null)`

4. **Event Handlers**:
   - Change `(e: React.MouseEvent) => {}` to `(e) => {}`
   - Change `(e: React.ChangeEvent<HTMLInputElement>) => {}` to `(e) => {}`

## Example Conversion

### TypeScript Version (button.tsx)
```tsx
import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn("button-class", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

### JavaScript Version (button.jsx)
```jsx
import React from "react";
import { cn } from "@/lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn("button-class", className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
```

## Steps for Each Component

1. Create a new file with the `.jsx` extension
2. Copy the content from the `.tsx` file
3. Remove type annotations and interfaces
4. Save the file
5. Test the component to ensure it works correctly

## Common UI Components to Convert

Here's a list of UI components to convert from `.tsx` to `.jsx`:

- accordion.jsx
- alert-dialog.jsx
- alert.jsx
- aspect-ratio.jsx
- avatar.jsx
- badge.jsx
- breadcrumb.jsx
- button.jsx
- calendar.jsx
- card.jsx
- carousel.jsx
- chart.jsx
- checkbox.jsx
- collapsible.jsx
- command.jsx
- context-menu.jsx
- dialog.jsx
- drawer.jsx
- dropdown-menu.jsx
- form.jsx
- hover-card.jsx
- input-otp.jsx
- input.jsx
- label.jsx
- menubar.jsx
- navigation-menu.jsx
- pagination.jsx
- popover.jsx
- progress.jsx
- radio-group.jsx
- resizable.jsx
- scroll-area.jsx
- select.jsx
- separator.jsx
- sheet.jsx
- sidebar.jsx
- skeleton.jsx
- slider.jsx
- switch.jsx
- table.jsx
- tabs.jsx
- textarea.jsx
- toast.jsx
- toaster.jsx
- toggle-group.jsx
- toggle.jsx
- tooltip.jsx

After converting all components, update your imports to reference the JavaScript files.