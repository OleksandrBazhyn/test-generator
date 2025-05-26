import React from "react";

const AboutPage: React.FC = () => (
  <div style={{ maxWidth: 700, margin: "0 auto", padding: 32 }}>
    <h1>About the Project</h1>
    <p>
      This project was developed by <b>Oleksandr Bazhyn</b>, a 3rd year student of the TTP-31 group,<br />
      Department of Programming Theory and Technologies,<br />
      Faculty of Computer Science and Cybernetics,<br />
      Taras Shevchenko National University of Kyiv.<br />
      <i>Coursework project, 2025.</i>
    </p>
    <p>
      The service allows you to generate, take, and review tests, as well as export them to PDF. <br />
      You can create unique tests, test your knowledge, and save your results.
    </p>
    <p>
      <b>Note:</b> This is a demo version for educational purposes only.<br />
      The service is not intended for commercial use and does not store personal data.
    </p>
    <hr style={{ margin: "24px 0" }} />
    <h3>Contacts & Links</h3>
    <ul style={{ fontSize: 16, lineHeight: "1.9" }}>
      <li>
        <b>GitHub:</b>{" "}
        <a href="https://github.com/OleksandrBazhyn" target="_blank" rel="noopener noreferrer">
          github.com/OleksandrBazhyn
        </a>
      </li>
      <li>
        <b>Instagram:</b>{" "}
        <a href="https://www.instagram.com/dgwjew_/" target="_blank" rel="noopener noreferrer">
          @dgwjew_
        </a>
      </li>
      <li>
        <b>Email:</b>{" "}
        <a href="mailto:olexandrbazhyn@gmail.com">olexandrbazhyn@gmail.com</a>
      </li>
    </ul>
  </div>
);

export default AboutPage;
