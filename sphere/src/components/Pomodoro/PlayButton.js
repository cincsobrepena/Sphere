import PlayArrowIcon from '@mui/icons-material/PlayArrow';

function PlayButton(props) {
    return (
      <button {...props}>
        <PlayArrowIcon
          sx={{
            fontSize: '3rem',
          }}
        />
      </button>
    );
}

export default PlayButton;