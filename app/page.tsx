import { Box, Container } from '@mui/material';
import InvestorForm from '@/components/InvestorForm';

export default function Home() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
        }}
      >
        <InvestorForm />
      </Box>
    </Container>
  );
}
