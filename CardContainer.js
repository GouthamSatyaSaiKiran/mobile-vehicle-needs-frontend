import React from 'react';
import Card from './Card';

function CardContainer() {
  return (
    <div className="card-container">
      <Card
        image="https://5.imimg.com/data5/GL/WP/GLADMIN-57624007/fuel-delivery-services-1000x1000.png"
        title="Fuel Service"
        description="Running low? We'll bring fuel directly to your location, day or night, so you can get back on the road without delay."
      />

      <Card
        image="https://t4.ftcdn.net/jpg/01/27/21/11/240_F_127211113_7B7THvJVruL4NfqxAJOUH5k7unPZVXYS.jpg"
        title="Mechanic Service"
        description="Experiencing a minor issue? Our technicians can diagnose and fix common vehicle problems on-site."
      />

      <Card
        image="https://towexpert.com.au/wp-content/uploads/2025/03/towexpert-image10-1024x683.jpg"
        title="Emergency Towing"
        description="For major breakdowns, we can arrange safe and prompt towing services to the nearest service center."
      />
    </div>
  );
}

export default CardContainer;
