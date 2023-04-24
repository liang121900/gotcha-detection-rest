import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import {Box, Button, Container, Typography} from '@mui/material';
import Alert from '@mui/material/Alert';
import CardMedia from '@mui/material/CardMedia';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import _ from 'lodash';
import {useCallback, useEffect, useRef, useState} from 'react';
import DropZone from '../component/DropZone';
import {DETECTION_PROCESS_STATUS} from '../Constant';
import ConfidenceThresholdSlider from '../component/ConfidenceThresholdSlider';
import useLogin from "../hook/useLogin"
import {useSelector} from "react-redux";
import { Buffer } from 'buffer';

function getProcessButtonValue(processStatus) {
  switch (processStatus) {
    case DETECTION_PROCESS_STATUS.PROCESSING: return "Processing"
    case DETECTION_PROCESS_STATUS.CREATED: return "Queued"
    default: return "Detect"
  }
}

function shouldDisableInput(processStatus) {
  switch (processStatus) {
    case DETECTION_PROCESS_STATUS.PROCESSING: return true
    case DETECTION_PROCESS_STATUS.CREATED: return true
    default: return false
  }
}

export default function ImageDetectionPage() {
  const {redirectToLogin, LoginLink} = useLogin()
  const authToken = useSelector((state) => state?.user?.auth?.idToken);

  const [file, setFile] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [processStatus, setProcessStatus] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [confidenceThreshold, setConfidenceThreshold] = useState(30);
  const [detectionResult, setDetctionResult] = useState(null);
  const bottomRef = useRef(null);

  const isDetectionProcessFinished = (status) => _.indexOf([DETECTION_PROCESS_STATUS.ERRORED, DETECTION_PROCESS_STATUS.PROCESSED], status) >= 0

  const resetFile = () => setFile(null)

  const resetStateBeforeRequest = () => {
    setErrorMessage("");
    setProcessStatus(null);
  }

  const sendDetectionRequest = useCallback(async (file) => {
    let formData = new FormData();
    formData.append('file', file);
    formData.append('confidenceThreshold', Number(confidenceThreshold / 100));
    const response = await axios.post('/api/detection-requests', formData, { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': authToken } })
    return _.get(response, 'data.requestId')
  }, [confidenceThreshold, authToken])

  const getRequestStatus = useCallback(async (requestId) => {
    // console.log('>> requestId >> ', requestId);
    const response = await axios.get(`/api/detection-requests/${requestId}`, { headers: { 'Authorization': authToken } })
    return _.get(response, 'data.status',)
  }, [authToken])

  const getDetectionResult = useCallback(async (requestId) => {
    const detectionResultUrl = `${process.env.REACT_APP_API_BASE_URL || ''}/api/detection-results/${requestId}`;
    const response = await axios.get(detectionResultUrl, {
      responseType: "arraybuffer",
      headers: { 'Authorization': authToken }
    })
    setDetctionResult(Buffer.from(response?.data, "binary").toString("base64"))
  },[authToken])

  const onDrop = useCallback((acceptedFiles) => {
    setFile(_.get(acceptedFiles, '[0]'))
    console.log(acceptedFiles);
  }, [])

  const onDectectButtonClicked = useCallback(async () => {
    if (file) {
      resetStateBeforeRequest()
      try {
        let status = DETECTION_PROCESS_STATUS.CREATED
        setProcessStatus(status)
        const requestId = await sendDetectionRequest(file)
        setRequestId(requestId)
        let i = 1
        while (!isDetectionProcessFinished(status)) {
          await new Promise(resolve => setTimeout(resolve, i * 1000));
          status = await getRequestStatus(requestId);
          setProcessStatus(status)
          i = Math.pow(1.25, i)
        }
        getDetectionResult(requestId)
        bottomRef.current.scrollIntoView({ alignToTop: false, behavior: 'smooth', block: "end", inline: "end" });
      } catch (e) {
          if (e?.response?.status === 401) {
              await redirectToLogin()
          }

        setProcessStatus(DETECTION_PROCESS_STATUS.ERRORED)
        const msg = e?.response?.data?.message || e.toString();
        setErrorMessage(msg)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      }
    }
  }, [file, sendDetectionRequest, redirectToLogin])

  useEffect(() => {
    const fetchExampleImage = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL ? 'http://localhost:3000' : ''}/detection-example.jpg`, { responseType: 'blob' });
        setFile(new File([response.data], "detection-example.jpg", { type: 'image/jpeg', lastModified: Date.now() }));
      } catch (e) {
        const msg = e?.response?.data?.message || e.toString();
        setErrorMessage(msg)
      }
    }
    fetchExampleImage();
  }, []);

  return (
    // <Layout>
    <Box sx={{ flexGrow: 1, marginTop: "1%" }}>
      <Typography color="primary" variant='h4' sx={{ mb: '0.2em' }}>
        Object Detection from Image
      </Typography>

      <Stack spacing={2} align="center" justify="center" alignItems="center">
        {isDetectionProcessFinished && errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <Container >
          <DropZone disabled={shouldDisableInput(processStatus)}
            resetFile={resetFile}
            file={file}
            onDrop={onDrop}
            preview={true}
            bodyMessageActive="Drop the image here..."
            bodyMessageDefault="Drag 'n' drop an image here, or click to select file" />
        </Container>

        <ConfidenceThresholdSlider confidenceThreshold={confidenceThreshold} setConfidenceThreshold={setConfidenceThreshold} />

        <Container>
          <Button disabled={shouldDisableInput(processStatus) || !file}
            onClick={onDectectButtonClicked}
            startIcon={<KeyboardDoubleArrowDownIcon />}
            variant="contained"
            endIcon={shouldDisableInput(processStatus) ? <CircularProgress size="1rem" color="inherit" /> : <ImageSearchIcon />}>
            {getProcessButtonValue(processStatus)}
          </Button>
        </Container>

        {processStatus === DETECTION_PROCESS_STATUS.PROCESSED && detectionResult &&
          <Container>
            <CardMedia
              component="img"
              image={`data:;base64,${detectionResult}`}
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