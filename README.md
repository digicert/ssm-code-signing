# Code signing with Software Trust Manager

## New GitHub Actions / Deprecation notice

DigiCert has released a new, separate iteration of its code signing GitHub Actions. As a result, this GitHub Actions (**Code signing with Software Trust Manager**) will be deprecated.

End-of-service will take place on February 1, 2026.

End-of-life will take place on February 28, 2026.

- To learn more about the new GitHub Actions, see [DigiCert Binary Signing](https://github.com/marketplace/actions/digicert-binary-signing).
- To learn how to migrate your existing configurations, see the **Migrate to new GitHub Actions** section below.

### Migrate to new GitHub Actions
With the introduction of [DigiCert Binary Signing](https://github.com/marketplace/actions/digicert-binary-signing), DigiCert will be deprecating this GitHub Actions (**Code signing with Software Trust Manager**).

To avoid any disruptions, please migrate from the old GitHub Actions to the new GitHub Actions. 

To migrate, replace the following **uses** line in your existing repo. 

Replace <code>digicert/ssm-code-signing@v1.1.1</code> with <code>digicert/code-signing-software-trust-action@v1.0.0@v1.0.0</code>.  

Review the following snippet:

<pre>
- name: Setup Software Trust Manager (old)
  id: stm-setup
  uses: digicert/ssm-code-signing@v1.1.1 # latest version

- name: Setup Software Trust Manager (new)
  id: stm-setup
  uses: digicert/code-signing-software-trust-action@v1.0.0 # latest released version
</pre>



## Overview

Code Signing with Software Trust Manager GitHub action is a streamlined keypair-based signing workflow that improves software security and seamlessly integrates with DevOps processes to sign binaries on **Windows** and **Linux**.

This GitHub action automates the installation and configuration of Software Trust Manager client tools, enabling developers to quickly become signing-ready for GitHub action workflows.

## Software Trust Manager

DigiCert® Software Trust Manager provides a solution to manage and automate your code signing workflows in a secure way. 

**Software Trust Manager will:**
- Require multi-factor authentication (MFA) for signing.
- Prevent unauthorized access or misuse of keys and certificates.
- Enforce consistency and compliance of security policies.
- Guard against insertion of malware during software releases.
- Expedite remediation by giving you an audit history of all actions taken within your account.

**You can use Software Trust Manager to securely:**
- Generate and manage your credentials.
- Create, edit, import, export, or delete keypairs.
- Generate certificates using a keypair in your account.
- View your audit and signature logs.
- Create releases.
- Sign code.

## DigiCert ONE account

Software Trust Manager is part of the DigiCert ONE platform, which also includes DigiCert® Trust Lifecycle Manager, DigiCert® Document Trust Manager, and DigiCert® IoT Trust Manager, enabling organizations to manage their diverse PKI workflows from a single pane of glass.

You require a DigiCert ONE account to access Software Trust Manager. If you do not currently have a DigiCert ONE account, you can request a 30-day free trial account from [DigiCert Sales.](https://www.digicert.com/contact-us)

## Which client tools will be installed and configured?
- [Signing Manager Controller (SMCTL)](https://docs.digicert.com/en/software-trust-manager/client-tools/command-line-interface/smctl.html)
SMCTL provides a Command Line Interface (CLI) that facilitates manual or automated private key, certificate management, and signing with or without the need for human intervention.

- [PKCS11 library](https://docs.digicert.com/en/software-trust-manager/tools/cryptographic-libraries-and-frameworks/pkcs11-library.html)
The PKCS11 library handles secure key generation, application hash signing, and associated certificate-related requirements when the signing request does not require the transportation of files and intellectual property.

- [KSP library](https://docs.digicert.com/en/software-trust-manager/tools/cryptographic-libraries-and-frameworks/ksp.html)
DigiCert​​®​​ Software Trust Manager KSP is a Microsoft CNG (Cryptographic: Next Generation) library-based client-side tool

- [JCE library](https://docs.digicert.com/en/software-trust-manager/tools/cryptographic-libraries-and-frameworks/jce.html)
The JCE library is used for signing with Jarsigner and integrates with any operating system that supports Java.

## Use cases

This is a list of popular use cases supported by Software Trust Manager. This is not a comprehensive list.
- APK signing
- ClickOnce signing
- Container signing 
- Docker signing
- HLK and HCK signing
- JWT signing 
- KSP signing
- OVA and OVF signing
- PKCS11 signing
- Strong name signing
- Visual Studio signing
- XML detached signing
- XML signing

## Signing tools

This is a list of popular signing tools supported by Software Trust Manager. This is not a comprehensive list.
- Jarsigner
- jSign
- jwt.io (for JWT signing)
- Keytool
- Mage
- NuGet
- OpenSSL 
- Osslsigncode
- p11tool
- Podman (for container signing)
- Sign4j
- SignTool (for Microsoft authenticode signing)
- Xmlsectool

## Documentation & Guides

For comprehensive documentation, refer to: 
[GitHub custom action for keypair signing](https://docs.digicert.com/en/software-trust-manager/ci-cd-integrations-and-deployment-pipelines/plugins/github/install-client-tools-for-standard-keypair-signing-on-github.html)

## Feedback and issues
[Contact DigiCert](https://www.digicert.com/contact-us)

## Learn more
To learn more about centralizing and automating your code signing workflows with Software Trust Manager, reach out to [Sales/Enquiry](mailto:sales@digicert.com) or visit: https://www.digicert.com/software-trust-manager
