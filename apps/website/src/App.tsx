import * as OtpInput from "headless-otp-input";

function App() {
  return (
    <>
      <h1>headless-otp-input</h1>
      <OtpInput.Root>
        <OtpInput.Field />
        <OtpInput.Field />
        <OtpInput.Field />
        <span>-</span>
        <OtpInput.Field />
        <OtpInput.Field />
        <OtpInput.Field />
      </OtpInput.Root>
    </>
  );
}

export default App;