import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import Switch from 'react-switch';
import 'react-dropdown/style.css';

const ServicesDropdown = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceOn, setServiceOn] = useState(false);
  const options = ['Kafka', 'PostgreSQL'];

  const handleSwitchChange = (checked) => {
    setServiceOn(checked);
    if (checked) {
      deployService(selectedService);
    } else {
      undeployService(selectedService);
    }
  };

  const deployService = (service) => {

  };

  const undeployService = (service) => {

  };

  return (
    <div className="services-dropdown">
      <Dropdown
        options={options}
        onChange={(option) => setSelectedService(option.value)}
        value={selectedService}
        placeholder="Select a service"
      />
      {selectedService && (
        <Switch
          onChange={handleSwitchChange}
          checked={isServiceOn}
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
          className="react-switch"
        />
      )}
    </div>
  );
};

export default ServicesDropdown;