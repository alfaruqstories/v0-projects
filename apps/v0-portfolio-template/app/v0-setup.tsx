"use client";

import { checkEnvs } from "@/lib/actions";
import { _PlaygroundInfo } from "@/basehub";
import { SetupToolbar } from "@joycostudio/v0-setup";

interface V0SetupProps {
  playgroundInfo: Pick<
    _PlaygroundInfo,
    "editUrl" | "claimUrl" | "expiresAt"
  > | null;
}

const ArrowUpRightIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
};

const ClockIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-clock-icon lucide-clock"
    >
      <path d="M12 6v6l4 2" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
};

const formatTimeRemaining = (expiresAt: string | null) => {
  if (!expiresAt) return "expired";
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) return "expired";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""}, ${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
};

export const V0Setup = ({ playgroundInfo }: V0SetupProps) => {
  const forkCta = (
    <a
      href={playgroundInfo?.editUrl}
      className="v0-setup-toolbar-addon-button"
      target="_blank"
      rel="noreferrer"
    >
      Fork basehub repo
      <span>
        <ArrowUpRightIcon />
      </span>
    </a>
  );

  return (
    <SetupToolbar
      title="V0 Portfolio Setup"
      description="Setup your V0 portfolio project"
      addon={{
        BASEHUB_TOKEN: playgroundInfo?.editUrl ? (
          <>
            <style>
              {
                /* css */ `
                .v0-setup-toolbar-addon-button {
                  background: #FF6C02;
                  transition: background-color 0.2s ease-out;
                  margin-top: 16px;
                  width: 100%;
                  height: 36px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  padding: 0 12px;
                  border-radius: 6px;
                  color: white;
                  font-weight: 600;
                  font-size: 14px;
                  gap: 4px;
                }

                .v0-expiry-warning {
                  margin-top: 16px;
                  background: #FEF3C8;
                  box-shadow: inset 0 0px 0px 1px rgba(0, 0, 0, 0.05);
                  color: #D97806;
                  padding: 12px;
                  border-radius: 6px;
                  font-size: 14px;
                }

                .v0-setup-toolbar-addon-button:hover {
                  background: #FF8B35;
                }
              `
              }
            </style>
            {playgroundInfo.expiresAt ? (
              <div className="v0-expiry-warning">
                <div
                  style={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <ClockIcon />
                  <p>
                    Your playground will expire on {formatTimeRemaining(playgroundInfo.expiresAt)}.{" "}
                    {playgroundInfo.claimUrl && (
                      <a
                        href={playgroundInfo.claimUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{  
                          textDecoration: 'underline'
                        }}
                      >
                        Claim it.
                      </a>
                    )}
                  </p>
                </div>
                {forkCta}
              </div>
            ) : (
              forkCta
            )}
          </>
        ) : null,
      }}
      envCheckAction={checkEnvs}
    />
  );
};

export default V0Setup;
