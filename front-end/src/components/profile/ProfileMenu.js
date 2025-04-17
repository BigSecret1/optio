import React, { useState } from "react";

import UserAvatar from "./Avatar";
import Options from "./Options";

function ProfileMenu() {
  const menuOptionsForTitleBox = ["Your account", "Your projects", "Sign out"];

  return (
    <div>
      <Options options={menuOptionsForTitleBox}>
        <UserAvatar />
      </Options>
    </div>
  );
}

export default ProfileMenu;
