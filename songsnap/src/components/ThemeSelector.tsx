import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void;
}
function ThemeSelector({ onThemeSelect }: ThemeSelectorProps) {

  interface Theme {
    Theme: string;
  }


  const [themes, setThemes] = React.useState<Theme []>([{ Theme: '' }]);
  const [selectedTheme, setSelectedTheme] = React.useState<string | null>(null);
  const [isThemesLoaded, setIsThemesLoaded] = React.useState<boolean>(false);

  const fetchThemes = async () => {
    try {
      const response = await axios.get('/themes');
      const data = await response.data;

      // Create a Set to store unique themes
      const uniqueThemes = new Set();

      // Filter the data array to remove duplicates
      const filteredData = data.filter((theme: Theme) => {
        if (!uniqueThemes.has(theme.Theme)) {
          uniqueThemes.add(theme.Theme);
          return true; // Include this theme in the filtered result
        }
        return false; // Skip this theme (duplicate)
      });

      setThemes(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getThemes = async () => {
      await fetchThemes();
      if (themes.length > 0) {
        setIsThemesLoaded(true);
      }
    };
    getThemes();
  }, []);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement> | any) => {
    const selectedValue = event.target.value;
    setSelectedTheme(selectedValue);

    // Call the callback function in the parent component with the selected theme
    onThemeSelect(selectedValue);
  };






  return (
    <>
      <Form.Control as="select" className="me-sm-2" required onChange={handleThemeChange}>
        <option value="">Select a theme</option> {/* Add this line */}
        {isThemesLoaded ? (
          themes.map((theme, index) => (
            <option key={`theme-${index}`} value={theme.Theme}>
              {theme.Theme}
            </option>
          ))
        ) : null}
      </Form.Control>

      <Dropdown as={Form.Control.Feedback} type="invalid">
        <Dropdown.Toggle variant="primary" id="dropdown-basic">
          Profile
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">View Profile</Dropdown.Item>
          <Dropdown.Item href="#/action-2">Log Out</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </>
  );
}

export default ThemeSelector;
