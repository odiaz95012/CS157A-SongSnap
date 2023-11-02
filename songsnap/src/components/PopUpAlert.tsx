import React from 'react';
import Alert from 'react-bootstrap/Alert';

interface Alert {
  text: string;
  variant: string;
}

function PopUpAlert( { text, variant }: Alert ) {
  return (
    <Alert variant={variant}> {/* Use the variant prop to set the alert type */}
      {text}
    </Alert>
  );
}

export default PopUpAlert;