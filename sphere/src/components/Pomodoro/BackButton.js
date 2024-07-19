import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function BackButton(props) {
  return (
    <button {...props} className={'with-text'}>
      <ArrowBackIcon
        sx={{
          fontSize: '2rem',
        }}
      />
      Back
    </button>
  );
}

export default BackButton;