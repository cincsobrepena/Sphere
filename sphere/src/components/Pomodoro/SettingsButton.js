import SettingsIcon from '@mui/icons-material/Settings';

function SettingsButton(props) {
    return (
      <button {...props} className={'with-text'}>
        <SettingsIcon
          sx={{
            fontSize: '2rem',
          }}
        />
        Settings
      </button>
    );
  }
  
  export default SettingsButton;