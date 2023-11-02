import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

interface RadioGroupProps {
  numRadios: number;
  radioLabels: string[];
  onRadioSelect?: (selectedRadio: string) => void;
}


function RadioGroup({ numRadios, radioLabels, onRadioSelect }: RadioGroupProps) {


  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedRadio(event.target.value);
    if(event.target.value && onRadioSelect){
      onRadioSelect(event.target.value);
    }
    
  };

  return (
    <>
      {Array.from({ length: numRadios }, (_, index) => (
        <div key={`radio-${index}`} className="mb-2">
          <Form.Check
            type="radio"
            id={`radio-${index}`}
            label={radioLabels[index]}
            value={radioLabels[index]}
            checked={selectedRadio === radioLabels[index]}
            onChange={handleRadioChange}
          />
        </div>
      ))}
    </>
  );
}

export default RadioGroup;
