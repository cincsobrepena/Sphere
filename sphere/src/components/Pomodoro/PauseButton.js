import PauseIcon from '@mui/icons-material/Pause';

function PauseButton(props) {
    return (
      <button {...props}>
        <PauseIcon
          sx={{
            fontSize: '3rem',
          }}
        />
      </button>
    );
}

export default PauseButton;