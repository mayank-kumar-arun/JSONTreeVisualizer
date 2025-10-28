import { useState } from "react";

export default function useJsonParser() {
  const [error, setError] = useState(null);

  const parseJson = (input) => {
    try {
      const data = JSON.parse(input);
      setError(null);
      return { valid: true, data };
    } catch {
      setError("Invalid JSON format ❌");
      return { valid: false, data: null };
    }
  };

  return { isValidJson: !error, parseJson, error };
}
