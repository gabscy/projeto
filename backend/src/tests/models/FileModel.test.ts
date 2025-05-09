import { FileModel } from "../../models/FileModel";

jest.mock("@supabase/supabase-js", () => ({
    createClient: jest.fn(() => ({
        storage: {
            from: jest.fn(() => ({
                upload: jest.fn(async () => ({ data: { path: "test/image.jpg" }, error: null })),
                getPublicUrl: jest.fn(() => ({ data: { publicUrl: "https://example.com/test/image.jpg" }, error: null }))
            }))
        }
    }))
}));

describe("FileModel - uploadImage", () => {
    let fileModel: FileModel;

    beforeEach(() => {
        fileModel = new FileModel();
    });

    test("should return a string URL when the file is uploaded successfully", async () => {
        const fileMock = {
            originalname: "test.png",
            buffer: Buffer.from("fake image data")
        } as any;

        const result = await fileModel.uploadImage(fileMock);

        expect(typeof result).toBe("string");
    });
});