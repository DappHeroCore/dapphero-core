import { useState, useEffect } from "react";


// add types
function useGetStaticFunc(instance: any, signature: any) {
  const [value, setValue] = useState(null);

  useEffect(() => {
    async function getValue() {
      let value;
      try {
        value = await instance.methods[signature]().call();
      } catch (error) {
        console.log("The Function View Static error: ", error);
      }
      setValue(value);
    }
    getValue();
  }, []);

  return value;
}

export { useGetStaticFunc };
