function Button({ 
  children, 
  className = "", 
  onClick, 
  type = "button", 
  disabled = false, 
  ...props 
}) {
  return (
    <button 
      type={type} 
      className={className} 
      onClick={onClick} 
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;