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

export default function Search({ fetchUsers, members, onAddMember }) {
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!query) {
      setOptions([]);
      return;
    }

    async function callFetchUsers() {
      const searchResults = await fetchUsers(query);
      if (!searchResults) {
        throw console.error("Got response while fetching users!");
      }
      setOptions(searchResults);
    }

    callFetchUsers();
  }, [query, fetchUsers]);

  return (
    <Autocomplete
      freeSolo
      disableClearable
      options={options}
      inputValue={query}
      getOptionLabel={(o) =>
        typeof o === "string" ? o : `${o.name} · ${o.email}`
      }
      filterOptions={(x) => x}
      onChange={(e, value) => {
        if (
          value &&
          typeof value !== "string" &&
          !members.some((m) => m.id === value.id)
        ) {
          onAddMember(value);
          setQuery("");
        }
      }}
      PopperComponent={StyledPopper}
      renderInput={(params) => (
        <TextField
          {...params}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email"
          fullWidth
          InputProps={{
            ...params.InputProps,
            endAdornment: <SearchRoundedIcon />,
          }}
          sx={fieldSx}
        />
      )}
      renderOption={(props, option) => {
        const selected = members.some((m) => m.id === option.id);
        return (
          <Box component="li" {...props} key={option.id}>
            <Avatar
              src={option.avatarUrl}
              sx={{ width: 30, height: 30, mr: 1 }}
            >
              {initials(option.name)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" noWrap fontWeight={600}>
                {option.name}
              </Typography>
              <Typography variant="caption" color="text.secondary" noWrap>
                {option.email}
              </Typography>
            </Box>
            <Chip
              size="small"
              color={selected ? "success" : "primary"}
              icon={
                selected ? (
                  <CheckCircleRoundedIcon />
                ) : (
                  <PersonAddAlt1RoundedIcon />
                )
              }
              label={selected ? "Added" : "Add"}
              onClick={(e) => {
                e.stopPropagation();
                if (!selected) {
                  onAddMember(option);
                  setQuery("");
                }
              }}
              variant={selected ? "outlined" : "filled"}
            />
          </Box>
        );
      }}
      sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
    />
  );
}
