"use client";

import { useAuth } from "@/providers/auth";
import { ArrowRightOnRectangle } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";

import ChevronDown from "./icons/chevron-down";
import MapPin from "./icons/map-pin";
import Package from "./icons/package";
import User from "./icons/user";

const AccountNav = () => {
    const route = usePathname();
    const router = useRouter();
    const { logout, user } = useAuth();

    const handleLogout = async () => {
        await logout();
        router.refresh();
    };

    return (
        <div>
            <div className="small:hidden" data-testid="mobile-account-nav">
                {route !== "/account" ? (
                    <Link
                        className="flex items-center gap-x-2 text-small-regular py-2"
                        data-testid="account-main-link"
                        href="/account"
                    >
                        <>
                            <ChevronDown className="transform rotate-90" />
                            <span>Account</span>
                        </>
                    </Link>
                ) : (
                    <>
                        <div className="text-xl-semi mb-4 px-8">
                            Hello {user?.email}
                        </div>
                        <div className="text-base-regular">
                            <ul>
                                <li>
                                    <Link
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        data-testid="profile-link"
                                        href="/account/profile"
                                    >
                                        <>
                                            <div className="flex items-center gap-x-2">
                                                <User size={20} />
                                                <span>Profile</span>
                                            </div>
                                            <ChevronDown className="transform -rotate-90" />
                                        </>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        data-testid="addresses-link"
                                        href="/account/addresses"
                                    >
                                        <>
                                            <div className="flex items-center gap-x-2">
                                                <MapPin size={20} />
                                                <span>Addresses</span>
                                            </div>
                                            <ChevronDown className="transform -rotate-90" />
                                        </>
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8"
                                        data-testid="orders-link"
                                        href="/account/orders"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <Package size={20} />
                                            <span>Orders</span>
                                        </div>
                                        <ChevronDown className="transform -rotate-90" />
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        className="flex items-center justify-between py-4 border-b border-gray-200 px-8 w-full"
                                        data-testid="logout-button"
                                        onClick={handleLogout}
                                        type="button"
                                    >
                                        <div className="flex items-center gap-x-2">
                                            <ArrowRightOnRectangle />
                                            <span>Log out</span>
                                        </div>
                                        <ChevronDown className="transform -rotate-90" />
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                )}
            </div>
            <div className="hidden small:block" data-testid="account-nav">
                <div>
                    <div className="pb-4">
                        <h3 className="text-base-semi">Account</h3>
                    </div>
                    <div className="text-base-regular">
                        <ul className="flex mb-0 justify-start items-start flex-col gap-y-4">
                            <li>
                                <AccountNavLink
                                    data-testid="overview-link"
                                    href="/account"
                                    route={route}
                                >
                                    Overview
                                </AccountNavLink>
                            </li>
                            <li>
                                <AccountNavLink
                                    data-testid="profile-link"
                                    href="/account/profile"
                                    route={route}
                                >
                                    Profile
                                </AccountNavLink>
                            </li>
                            <li>
                                <AccountNavLink
                                    data-testid="addresses-link"
                                    href="/account/addresses"
                                    route={route}
                                >
                                    Addresses
                                </AccountNavLink>
                            </li>
                            <li>
                                <AccountNavLink
                                    data-testid="orders-link"
                                    href="/account/orders"
                                    route={route}
                                >
                                    Orders
                                </AccountNavLink>
                            </li>
                            <li className="text-grey-700">
                                <button
                                    data-testid="logout-button"
                                    onClick={handleLogout}
                                    type="button"
                                >
                                    Log out
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

type AccountNavLinkProps = {
    children: React.ReactNode;
    "data-testid"?: string;
    href: string;
    route: string;
};

const AccountNavLink = ({
    children,
    "data-testid": dataTestId,
    href,
    route,
}: AccountNavLinkProps) => {
    const active = route === href;
    return (
        <Link
            className={clx("text-ui-fg-subtle hover:text-ui-fg-base", {
                "text-ui-fg-base font-semibold": active,
            })}
            data-testid={dataTestId}
            href={href}
        >
            {children}
        </Link>
    );
};

export default AccountNav;
