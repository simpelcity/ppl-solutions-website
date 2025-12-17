import { Container, Image } from "react-bootstrap";

interface StartBannerProps {
  children: React.ReactNode;
}

export default function StartBanner({ children }: StartBannerProps) {
  return (
    <section className="d-flex w-100 text-primary">
      <Container className="px-0 position-relative d-flex justify-content-center" fluid>
        <Image
          src={"/assets/images/banner-2.png"}
          alt="PPL Solutions Truck"
          className="banner-img w-100 object-fit-cover"
        />
        <div className="overlay position-absolute top-0 w-100 h-100 d-flex justify-content-center align-items-center">
          <h1 className="text-uppercase">{children}</h1>
        </div>
      </Container>
    </section>
  );
}
