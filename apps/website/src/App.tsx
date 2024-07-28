import { useState } from "react";
import * as OtpInput from "headless-otp-input";

function App() {
  const [value, setValue] = useState(["", "", "", "", "", ""]);

  return (
    <>
      <h1>headless-otp-input</h1>
      <OtpInput.Root
        value={value}
        onChange={setValue}
        onCompleted={(value) => console.log("onCompleted:", value)}
      >
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
