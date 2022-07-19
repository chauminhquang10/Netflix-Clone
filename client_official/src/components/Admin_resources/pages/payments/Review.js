import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";

export default function Review({ paymentDetail }) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List disablePadding>
        <ListItem
          key={paymentDetail.service_pack.packId.title}
          sx={{ py: 1, px: 0 }}
        >
          <ListItemText primary={"Package Name"} />
          <Typography variant="body2">
            {paymentDetail.service_pack.packId.title}
          </Typography>
        </ListItem>
        <ListItem
          key={paymentDetail.service_pack.packId.title}
          sx={{ py: 1, px: 0 }}
        >
          <ListItemText primary={"Package Price"} />
          <Typography variant="body2">
            {paymentDetail.service_pack.packId.price}₫
          </Typography>
        </ListItem>
        <ListItem
          key={paymentDetail.service_pack.packId.title}
          sx={{ py: 1, px: 0 }}
        >
          <ListItemText primary={"Started At"} />
          <Typography variant="body2">
            {paymentDetail.service_pack.startedTime}
          </Typography>
        </ListItem>
        <ListItem
          key={paymentDetail.service_pack.packId.title}
          sx={{ py: 1, px: 0 }}
        >
          <ListItemText primary={"Expired At"} />
          <Typography variant="body2">
            {paymentDetail.service_pack.expireTime}
          </Typography>
        </ListItem>
        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {paymentDetail.service_pack.packId.price -
              paymentDetail.discountPrice}
            ₫
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            User Info
          </Typography>
          <Typography gutterBottom>Name: {paymentDetail.name}</Typography>
          <Typography gutterBottom>
            Address:{" "}
            {paymentDetail.address.line1 + " - " + paymentDetail.address.city}
          </Typography>
          <Typography gutterBottom>
            Postal Code: {paymentDetail.address.postal_code}
          </Typography>
          <Typography gutterBottom>
            Country: {paymentDetail.address.country_code}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Payment details
          </Typography>
          <Grid container>
            <React.Fragment>
              <Grid item xs={6}>
                <Typography gutterBottom>Payment Method</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography gutterBottom>
                  {paymentDetail.paymentMethod}
                </Typography>
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
