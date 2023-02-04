import React from "react";


interface IError {
    error:ErrorBoundary | null;
}


export default class ErrorBoundary extends React.Component<any,IError> {
    constructor(props:React.PropsWithChildren) {
      super(props);
      this.state = { error: null };
    }
    
    componentDidCatch(error:any) {
      // Catch errors in any components below and re-render with error message
      this.setState({
        error: error,
      })
      // You can also log error messages to an error reporting service here
    }
    
    render() {
      if (this.state.error) {
        // Error path
        return (
          <div>
            <h2>Something went wrong.</h2>
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
            </details>
          </div>
        );
      }
      // Normally, just render children
      return this.props.children;
    }  
  }