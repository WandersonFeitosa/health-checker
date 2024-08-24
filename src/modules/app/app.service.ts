export class AppService {
  public async healthCheck(): Promise<{ status: string }> {
    return {
      status: "up",
    };
  }
}
