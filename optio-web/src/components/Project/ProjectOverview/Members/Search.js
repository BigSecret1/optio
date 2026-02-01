import React, { useState, useEffect } from "react";

import {
  Autocomplete,
  Box,
  Chip,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import PersonAddAlt1RoundedIcon from "@mui/icons-material/PersonAddAlt1Rounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import StyledPopper from "./StyledPaper";
import initials from "./utils/initials";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#e6edf3",
    "& fieldset": { borderColor: "#90caf9" },
    "&:hover fieldset": { borderColor: "#64b5f6" },
    "&.Mui-focused fieldset": { borderColor: "#2196f3" },
  },
};

export default function Search({ fetchUsers, members, addMember }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }

    callFetchUsers();
  }, [query, fetchUsers]);

  async function callFetchUsers() {
    const searchResults = await fetchUsers(query);
    if (!searchResults) {
      throw console.error("Got response while fetching users!");
    }
    setOptions(searchResults);
  }

  function handleSearchInputChange(e) {
    setQuery(e.target.value);
  }

  function handleAddMember(e, value) {
    addMember(value);
    setQuery("");
  }

  return (
    <Autocomplete
      options={options}
      inputValue={query}
      getOptionLabel={(searchResult) =>
        `${searchResult.firstName} ${searchResult.lastName}`
      }
      filterOptions={(searchResult) => searchResult} // Don't apply MUI filtering on Search API Response
      onChange={handleAddMember}
      PopperComponent={StyledPopper}
      renderInput={(params) => (
        <SearchBox
          params={params}
          query={query}
          handleSearchInputChange={handleSearchInputChange}
        />
      )}
      renderOption={(props, option) => (
        <MemberSearchResultBar {...props} option={option} members={members} />
      )}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
    />
  );
}

function SearchBox({ params, handleSearchInputChange, query }) {
  return (
    <TextField
      {...params}
      value={query}
      onChange={handleSearchInputChange}
      placeholder="Search by name or email"
      fullWidth
      InputProps={{
        ...params.InputProps,
        endAdornment: <SearchRoundedIcon />,
      }}
      sx={fieldSx}
    />
  );
}

function MemberSearchResultBar({ option, members = [], ...optionProps }) {
  const selected = members.some((m) => m.id === option.id);
  return (
    <Box component="li" {...optionProps} key={option.id}>
      <Avatar src={option.avatarUrl} sx={{ width: 38, height: 38, mr: 1 }}>
        {initials(`${option.firstName} ${option.lastName}`)}
      </Avatar>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" noWrap fontWeight={600}>
          {`${option.firstName} ${option.lastName}`}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          somemail@gmail.com
        </Typography>
      </Box>

      <Chip
        size="small"
        color={selected ? "success" : "primary"}
        icon={
          selected ? <CheckCircleRoundedIcon /> : <PersonAddAlt1RoundedIcon />
        }
        label={selected ? "Added" : "Add"}
        variant={selected ? "outlined" : "filled"}
      />
    </Box>
  );
}
