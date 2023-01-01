import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import { Box, Button, Container, Typography } from '@mui/material';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import _ from 'lodash';
import { useState, useCallback, useRef } from 'react';
import DropZone from '../component/DropZone';
import { DETECTION_PROCESS_STATUS } from '../Constant'
import Alert from '@mui/material/Alert';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Layout from '../component/Layout';

export default function ImageDetectionPage() {
  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const bottomRef = useRef(null);

  const isDetectionProcessFinished = (status) => _.indexOf([DETECTION_PROCESS_STATUS.ERRORED, DETECTION_PROCESS_STATUS.PROCESSED], status) >= 0

  const detectionResultUrl = `${process.env.REACT_APP_API_BASE_URL || ''}/api/detection-results/${requestId}`;

  const resetStateBeforeRequest = () => {
    setErrorMessage("");
    setProcessStatus(null);
  }

  const sendDetectionRequest = useCallback(async (file) => {
    let formData = new FormData();
    formData.append('file', file);
    const response = await axios.post('/api/detection-requests', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    return _.get(response, 'data.requestId')
  }, [])

  const getRequestStatus = async (requestId) => {
    console.log('>> requestId >> ', requestId);
    const response = await axios.get(`/api/detection-requests/${requestId}`)
    return _.get(response, 'data.status',)
  }

  const onDrop = useCallback((acceptedFiles) => {
    setFile(_.get(acceptedFiles, '[0]'))
    console.log(acceptedFiles);
  }, [])

  const onDectectButtonClicked = useCallback(async () => {
    if (file) {
      resetStateBeforeRequest()
      try {
        let status = DETECTION_PROCESS_STATUS.PROCESSING
        setProcessStatus(status)
        const requestId = await sendDetectionRequest(file)
        setRequestId(requestId)
        let i = 1
        while (!isDetectionProcessFinished(status)) {
          await new Promise(resolve => setTimeout(resolve, i * 1000));
          status = await getRequestStatus(requestId);
          setProcessStatus(status)
          i = Math.pow(2, i)
        }
        bottomRef.current.scrollIntoView({ alignToTop: false, behavior: 'smooth', block: "end", inline: "end" });
      } catch (e) {
        setProcessStatus(DETECTION_PROCESS_STATUS.ERRORED)
        console.log("err:" + e)
        setErrorMessage(e.toString())
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }, [file, sendDetectionRequest])

  return (
    // <Layout>
      <Box sx={{ flexGrow: 1, marginTop: "1%" }}>
        <Typography color="primary" variant='h4' sx={{mb:'0.2em'}}>
           Object Detection from Image
        </Typography>

        <Stack spacing={2} align="center" justify="center" alignItems="center">
          {isDetectionProcessFinished && errorMessage && <Alert severity="error">{errorMessage}</Alert>}
          <Container >
            <DropZone disabled={processStatus === DETECTION_PROCESS_STATUS.PROCESSING}
              setFile={setFile}
              file={file}
              onDrop={onDrop}
              preview={true}
              bodyMessageActive="Drop the image here..."
              bodyMessageDefault="Drag 'n' drop an image here, or click to select file" />
          </Container>
          <Container>
            <Button disabled={processStatus === DETECTION_PROCESS_STATUS.PROCESSING || !file}
              onClick={onDectectButtonClicked}
              startIcon={<KeyboardDoubleArrowDownIcon />}
              variant="contained"
              endIcon={processStatus === DETECTION_PROCESS_STATUS.PROCESSING ? <CircularProgress size="1rem" color="inherit" /> : <ImageSearchIcon />}>
              {processStatus === DETECTION_PROCESS_STATUS.PROCESSING ? "Processing" : "Detect"}
            </Button>
          </Container>

          {processStatus === DETECTION_PROCESS_STATUS.PROCESSED && detectionResultUrl &&
            <Container>
              <CardMedia
                component="img"
                image={detectionResultUrl}
                alt={"detection result"}
                title={""}
                sx={{ objectFit: "contain" }}
              />
            </Container>
          }
          <div ref={bottomRef} />
        </Stack>
      </Box>
    // </Layout>
  );
}