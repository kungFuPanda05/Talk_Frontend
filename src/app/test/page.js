import React from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { CheckCircleOutline, Star } from "@mui/icons-material";

const Pricing = () => {
  const plans = [
    {
      title: "Silver",
      price: "$59",
      duration: "Yearly",
      description: "Basic plan for personal websites.",
      features: ["500P", "Unlimited Chat Rooms", "Allow matching Users rated 3 or above", "1 week"],
      isRecommended: false,
    },
    {
      title: "Gold",
      price: "$199",
      duration: "Yearly",
      description: "Best for small businesses.",
      features: ["2000P", "Unlimited Chat Rooms", "Allow matching Users rated 4 or above", "1 month"],
      isRecommended: true,
    },
    {
      title: "Platinum",
      price: "$299",
      duration: "Yearly",
      description: "Complete solution for enterprises.",
      features: ["5000P", "Unlimited Chat Rooms", "Allow matching Users rated 4.5 or above", "2 month"],
      isRecommended: false,
    },
  ];

  return (
    <Box sx={{ paddingTop: '20px', backgroundColor: "#f5f5f5", overflowY: 'scroll', height: "100%" }}>
      <Container maxWidth="lg">
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Our Pricing Plans
        </Typography>

        <Grid container spacing={4}>
          {plans.map((plan, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  backgroundColor: plan.isRecommended ? "#fff8e1" : "white",
                  border: plan.isRecommended ? "2px solid #f57c00" : "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center" }}>
                    {plan.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    color="primary"
                    sx={{
                      textAlign: "center",
                      fontWeight: "bold",
                      mt: 2,
                    }}
                  >
                    {plan.price}
                    <Typography component="span" variant="body2" color="textSecondary">
                      {" / "}{plan.duration}
                    </Typography>
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="textSecondary"
                    align="center"
                    sx={{ mt: 2, mb: 3 }}
                  >
                    {plan.description}
                  </Typography>

                  <List>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircleOutline color="success" />
                        </ListItemIcon>
                        <ListItemText primary={feature} />
                      </ListItem>
                    ))}
                  </List>

                  <Button
                    variant={plan.isRecommended ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                    sx={{ mt: 3 }}
                  >
                    {plan.isRecommended ? "Recommended Plan" : "Choose Plan"}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Pricing;
