import React from 'react';
import '../styles/SongSnapPlayerStyles.css';


interface DzPlayerProps {
  dztype: string;
  trackID: number;
  backgroundTheme?: string;
}

const SongSnapPlayer: React.FC<DzPlayerProps> = ({ dztype, trackID, backgroundTheme }) => {

  const formatBackgroundThemeTxt = (backgroundTheme: string): string => {
    return backgroundTheme.replace(/\s+/g, '').toLowerCase();
  }



  return (
    <div className='container text-center d-flex justify-content-center align-items-center h-100 player-container'>
    {backgroundTheme && (
        <div className='theme-container'>
            <img
                src={require(`../images/${formatBackgroundThemeTxt(backgroundTheme)}.png`)}
                alt="Background Theme"
                className='theme'
            />
            <iframe
                id="dzplayer"
                title='SongSnapPlayer'
                data-dztype={dztype}
                src={`https://www.deezer.com/plugins/player?type=tracks&id=${trackID}&format=classic&color=007FEB&autoplay=false&playlist=true&width=700&height=550`}
                className='player'
            />
        </div>
    )}
</div>

  );
};

export default SongSnapPlayer;
