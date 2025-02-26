import { useMemo } from "react";

interface AccessControlProps {
  permission: any;
  upperRoleEditPermission?: boolean;
}

const useAccessControl = (props: AccessControlProps) => {
  const { permission, upperRoleEditPermission } = props;

  const cachedPermissions = useMemo(
    () => localStorage.getItem("allowedPermissions"),
    []
  );

  let allowedPermission: string[] = [];
  if (typeof cachedPermissions === "string") {
    allowedPermission = JSON.parse(cachedPermissions);
  }

  let isAllowed;
  if (
    upperRoleEditPermission !== undefined &&
    upperRoleEditPermission !== null
  ) {
    isAllowed = upperRoleEditPermission;
  } else if (Array.isArray(permission)) {
    isAllowed = permission.some((value: string) =>
      allowedPermission.includes(value)
    );
  } else {
    isAllowed = allowedPermission.includes(permission);
  }

  return isAllowed;
};

export default useAccessControl;
