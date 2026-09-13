import React from "react";
import { cn } from "../../utils/cn";

interface NavbarKenteBorderProps {
  className?: string;
}

/**
 * Woven Ghanaian kente band that runs along the very bottom edge of a navbar.
 *
 * IMPORTANT: This element MUST be rendered INSIDE the sticky <header> element
 * (as its last child). Because the header is sticky, the band stays attached to
 * the navbar bottom while the page scrolls. Placing it in the normal document
 * flow (after the header) makes it scroll away with the page content.
 */
export const NavbarKenteBorder: React.FC<NavbarKenteBorderProps> = ({
  className,
}) => (
  <div
    className={cn("w-full flex-shrink-0 kente-navbar-border", className)}
    aria-hidden="true"
  />
);