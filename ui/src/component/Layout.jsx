import RootHeader from "./RootHeader";
import Stack from '@mui/material/Stack';
export default function Layout({ children }) {
    return (
        <Stack width="100%">
            <RootHeader />
            {children}
        </Stack>
    );
}