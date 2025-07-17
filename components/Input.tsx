import React, { useState, useCallback, memo } from 'react';

const InputField = memo(function InputField({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}) {
  console.log(`${placeholder} re-rendered`);
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
});


export default InputField 
// export function OptimizedForm() {
//   const [input1, setInput1] = useState('');
//   const [input2, setInput2] = useState('');

//   console.log('OptimizedForm re-rendered');

//   const handleInput1Change = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => setInput1(e.target.value),
//     []
//   );

//   const handleInput2Change = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => setInput2(e.target.value),
//     []
//   );

//   return (
//     <div>
//       <InputField
//         value={input1}
//         onChange={handleInput1Change}
//         placeholder="First input"
//       />
//       <br />

//       <InputField
//         value={input2}
//         onChange={handleInput2Change}
//         placeholder="Second input"
//       />
//     </div>
//   );
// }
