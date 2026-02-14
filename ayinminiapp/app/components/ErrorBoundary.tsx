"use client";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}
interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
              Something went wrong loading contract data.
            </div>
            <div
              style={{
                marginTop: "0.5rem",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              Check your network connection and try again.
            </div>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                marginTop: "1rem",
                background: "rgba(0,255,136,0.1)",
                border: "1px solid rgba(0,255,136,0.2)",
                color: "#00ff88",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.75rem",
              }}
            >
              Retry
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
