import { jest } from "@jest/globals";

jest.unstable_mockModule("@emailjs/nodejs", () => ({
  default: {
    send: jest.fn(),
  },
}));

const { default: MailService } = await import("../app/modules/MailService.js");
const { default: emailjs } = await import("@emailjs/nodejs");

describe("MailService", () => {
  test("throw si config manquante", () => {
    expect(() => new MailService()).toThrow();
  });

  test("sendContactMessage appelle emailjs.send et retourne success", async () => {
    emailjs.send.mockResolvedValue({ status: 200 });

    const service = new MailService("service", "template", "key");
    const payload = { name: "Tony", email: "tony@mail.fr", message: "Hello" };

    const result = await service.sendContactMessage(payload);

    expect(emailjs.send).toHaveBeenCalledTimes(1);
    expect(result.success).toBe(true);
  });

  test("sendContactMessage throw si emailjs.send échoue", async () => {
    emailjs.send.mockRejectedValue(new Error("boom"));

    const service = new MailService("service", "template", "key");

    await expect(
      service.sendContactMessage({ name: "Tony", email: "tony@mail.fr", message: "Hello" })
    ).rejects.toThrow("Unable to send");
  });
});
