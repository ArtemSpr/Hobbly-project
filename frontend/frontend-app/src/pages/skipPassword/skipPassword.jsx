function SkipPassword() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Welcome, Guest!</h2>
      <p>You’re browsing without signing in. Some features may be limited.</p>
      
      <button onClick={() => alert('Continue as guest')}>
        Continue as Guest
      </button>

      <div style={{ marginTop: '1rem' }}>
        <p>Or</p>
        <button onClick={() => window.location.href = '/signUp'}>
          Sign Up
        </button>
        <button onClick={() => window.location.href = '/signIn'} style={{ marginLeft: '1rem' }}>
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SkipPassword