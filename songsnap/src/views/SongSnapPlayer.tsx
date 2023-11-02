import React from 'react';

interface DzPlayerProps {
  dztype: string;
  trackID: number;
}

const SongSnapPlayer: React.FC<DzPlayerProps> = ({ dztype, trackID }) => {
  return (
    <iframe
      id="dzplayer"
      title='SongSnapPlayer'
      data-dztype={dztype}
      src={`https://www.deezer.com/plugins/player?type=tracks&id=${trackID}&format=classic&color=007FEB&autoplay=false&playlist=true&width=700&height=550`}
      style={{ border: "none", overflow: "hidden" }}
      width="500"
      height="250"
    ></iframe>
  );
};

export default SongSnapPlayer;
