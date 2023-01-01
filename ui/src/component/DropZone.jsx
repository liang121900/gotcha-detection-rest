import { useState, useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#4be43b'
};

const rejectStyle = {
  borderColor: '#ff1744'
};


export default function DropZone({ file, onDrop, preview, bodyMessageActive, bodyMessageDefault, disabled }) {
  const [fileDataURL, setFileDataURL] = useState(null);

  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
    isDragActive
  } = useDropzone({ accept: { 'image/*': [] }, onDrop });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isFocused,
    isDragAccept,
    isDragReject
  ]);

  // update fileDataURL for file preview when file has changed.
  useEffect(() => {
    let fileReader, isCancel = false;
    if (file) {
      fileReader = new FileReader();
      fileReader.onload = (e) => {
        const { result } = e.target;
        if (result && !isCancel) {
          setFileDataURL(result)
        }
      }
      fileReader.readAsDataURL(file);
    }

    // cancel
    return () => {
      isCancel = true;
      if (fileReader && fileReader.readyState === 1) {
        fileReader.abort();
      }
    }

  }, [file]);

  return (
    <Box {...getRootProps({ style })}>
      <input disabled={disabled} {...getInputProps()} />
      {
        isDragActive ?
          <Typography sx={{ color: '#4be43b' }}>{bodyMessageActive}</Typography> :
          <Typography sx={{ color: '#526a6e' }}>{bodyMessageDefault}</Typography>
      }
      {
        preview && <CardMedia
          component="img"
          height="50%"
          image={fileDataURL}
          alt={""}
          title={""}
          sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
        />
      }
    </Box>
  )
}
