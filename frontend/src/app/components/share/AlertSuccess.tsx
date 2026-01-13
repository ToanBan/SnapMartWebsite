import React from 'react'

const AlertSuccess = ({message}:{message:string}) => {
  return (
    <>
    <div className="alert-success" style={{position:"fixed", top:"10px", right:0, zIndex:"1000", maxWidth:"300px", padding:"10px 20px "}}>
        <span className="icon">✓</span>
        <span className="message">{message}</span>
        <button className="close-btn">&times;</button>
    </div>
    </>
  )
}

export default AlertSuccess
