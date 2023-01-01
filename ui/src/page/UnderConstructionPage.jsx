import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export default function UnderConstructionPage() {
    return (
        <Stack id="error-page"z width="100%">
            <Typography color="primary" sx={{ mt: '0.2em' }} variant="h3" component="h4">Under Construction</Typography>
            <Typography sx={{ mt: '1em' }} variant="body1" gutterBottom>
                Sorry, this page is still under construction.
            </Typography>
            <Typography variant="body1" gutterBottom>
                The source code is available on the github repo <a href="https://github.com/liang121900/gotcha-detection-rest">https://github.com/liang121900/gotcha-detection-rest</a>.
            </Typography>
        </Stack>
    );
}