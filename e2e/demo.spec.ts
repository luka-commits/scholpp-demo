import { test, expect } from "@playwright/test";

const URL = process.env.DEMO_URL || "https://scholpp-demo.vercel.app";

test("landing renders all sections and CTA", async ({ page }) => {
  await page.goto(URL);
  await expect(page.getByRole("heading", { name: /Reisekoordinator/i })).toBeVisible();
  await expect(page.getByText("Ausgangslage").first()).toBeVisible();
  await expect(page.getByText("Workflow", { exact: false }).first()).toBeVisible();
  await expect(page.getByText("Phase 2+").first()).toBeVisible();
  await expect(page.getByRole("link", { name: /Live-Demo starten/i }).first()).toBeVisible();
});

test("demo flow — full state machine", async ({ page }) => {
  await page.goto(`${URL}/demo`);

  // Intro
  await expect(page.getByText(/Werksumzug nach Hannover/i)).toBeVisible();
  await page.getByRole("button", { name: /Inbox öffnen/i }).click();

  // Inbox
  await expect(page.getByText("REQ-2026-0412")).toBeVisible();
  await expect(page.getByRole("heading", { name: /Werksumzug Presse/i })).toBeVisible();
  await page.getByRole("button", { name: /Agent starten/i }).click();

  // Agent working
  await expect(page.getByText(/reasoning\.log/i)).toBeVisible();

  // Approval (wait for auto-transition, up to ~10s)
  await expect(page.getByText(/Vorschlag:.*Hannover-Einsatz/i)).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByText(/Hotel-Vergleich/i)).toBeVisible();
  await expect(page.getByText(/IntercityHotel Hannover-Langenhagen/i).first()).toBeVisible();
  await expect(page.getByText(/Warum Empfehlung/i)).toBeVisible();
  await expect(page.getByText(/Betriebsordnung/i).first()).toBeVisible();
  await expect(page.getByText(/Fahrzeug-Optionen/i)).toBeVisible();

  // Expand audit
  await page.getByText(/Audit-Log/i).click();
  await expect(page.getByText(/Betriebsordnung v2.3 geladen/i)).toBeVisible();

  // Approve
  await page.getByRole("button", { name: /Buchen & Freigeben/i }).click();

  // Success
  await expect(page.getByText(/Buchung abgeschlossen/i)).toBeVisible();

  // Impact
  await expect(page.getByText(/45-Minuten-Prozess/i)).toBeVisible({ timeout: 10000 });
  await expect(page.getByText(/Hochrechnung SCHOLPP-weit/i)).toBeVisible();

  // Reset
  await page.getByRole("button", { name: /Demo zurücksetzen/i }).first().click();
  await expect(page.getByText(/Werksumzug nach Hannover/i)).toBeVisible();
});
