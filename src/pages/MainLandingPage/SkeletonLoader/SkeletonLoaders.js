import { Box, Grid, Skeleton, Card, CardContent } from "@mui/material";

const NewsSkeletonLoader = () => (
  <Grid container spacing={2}>
    {[1, 2, 3].map((key) => (
      <Grid item xs={12} key={key}>
        <Skeleton variant="text" height={20} width="60%" />
        <Skeleton variant="text" height={20} width="80%" />
        <Skeleton variant="rectangular" height={50} width="100%" />
      </Grid>
    ))}
  </Grid>
);

const TwitterSkeletonLoader = () => (
  <Card sx={{ height: "374px" }}>
    <CardContent>
      <Box display="flex" alignItems="center" mb={2}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" height={20} width="60%" ml={2} />
      </Box>
      <Skeleton variant="rectangular" height={100} width="100%" />
    </CardContent>
  </Card>
);

const OurOfferingSkeletonLoader = () => {
  return (
    <Card>
      <Skeleton variant="rectangular" height={140} />
      <CardContent>
        <Skeleton variant="text" height={40} />
        <Skeleton variant="text" />
        <Skeleton variant="text" />
      </CardContent>
    </Card>
  );
};
const AboutComponentSkeletonLoader = () => {
  return (
    <Box
      p={4}
      style={{
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Box className="inner-box-screen">
        <Grid container spacing={4}>
          {/* Left Text Content Skeleton */}
          <Grid item xs={12} sm={6}>
            <Skeleton variant="text" height={40} width="60%" />
            <Skeleton variant="rectangular" height={200} width="100%" />
            <Skeleton variant="rectangular" height={50} width="30%" />
          </Grid>

          {/* Right Images Skeleton */}
          <Grid item xs={12} sm={6}>
            <Grid container spacing={4}>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={150} width="100%" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Skeleton variant="rectangular" height={150} width="100%" />
              </Grid>
            </Grid>

            {/* Contacts Section Skeleton */}
            <Box>
              <Skeleton variant="text" height={30} width="30%" />
              {Array.from(new Array(2)).map((_, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 1,
                    padding: 0,
                    background:
                      "linear-gradient(270deg, #FFFFFF 0%, rgba(219, 239, 188, 0.8) 100%)",
                  }}
                >
                  <CardContent>
                    <Skeleton variant="text" height={20} width="50%" />
                    <Skeleton variant="text" height={20} width="30%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={20} width="40%" />
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const AssetsHomeSkeletonLoader = ({ count = 5 }) => {
  return (
    <>
      {Array.from(new Array(count)).map((_, index) => (
        <Grid item xs={12} sm={4} key={index}>
          <Skeleton variant="rectangular" height={150} />
        </Grid>
      ))}
    </>
  );
};
export {
  NewsSkeletonLoader,
  TwitterSkeletonLoader,
  OurOfferingSkeletonLoader,
  AboutComponentSkeletonLoader,
  AssetsHomeSkeletonLoader,
};
