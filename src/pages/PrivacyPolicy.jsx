import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen py-20 animate-fadeIn bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-5xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-8">
          <Link to="/" className="text-gray-400 hover:text-white flex items-center gap-2 transition">
            <i className="fas fa-arrow-left"></i> Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400 text-lg">Last Updated: December 2024</p>
        </div>

        {/* Content */}
        <div className="glass-panel rounded-2xl p-8 md:p-12 space-y-8 text-gray-300 leading-relaxed">
          
          <div className="bg-cyan-900/20 border-l-4 border-cyan-500 p-6 rounded">
            <p className="text-lg font-semibold text-white mb-2">Your privacy is important to us.</p>
            <p className="text-gray-300">
              The user of this Website ("User") agrees to be bound by the terms and conditions of this privacy policy ("Policy"). In the event the terms and conditions of the Policy are not agreeable to the User, the User is requested to refrain from using this Website.
            </p>
          </div>

          <p>
            Ace2Examz ("Ace2Examz") is concerned about the privacy of the data and information of the Users accessing the website 'https://www.ace2examz.in' or mobile applications- 'Ace2Examz'.
          </p>

          <p>
            This Policy is a legally binding document between the User and Ace2Examz. The terms of this Policy will be effective upon the User's acceptance of the same (directly or indirectly in electronic form, by clicking on the "I accept the Privacy Policy" tab or by use of the Website) and will govern the relationship between the User and Ace2Examz.
          </p>

          <p>
            This Policy forms an electronic contract within the provisions of the Information Technology Act, 2000 ("IT Act"), the rules made thereunder and the amended provisions pertaining to electronic documents/records in various statutes as amended by the IT Act, from time to time. This Policy does not require any physical, electronic or digital signature.
          </p>

          <p>
            This Policy shall, at all times be read and construed in consonance and along with the terms of use and access of the Website and App.
          </p>

          <p>
            Ace2Examz will not differentiate between who is using the device to access the Website, so long as the log in/access credentials match with yours. In order to make the best use of the Website and enable your Information to be captured accurately on the Website, it is essential that you have logged in using your own credentials.
          </p>

          <p>
            This Policy highlights inter alia the type of data shared/collected from a User in the course of the User's usage of the Website. The Policy further intends to apprise the User of the purposes for which the data of the User is collected and the Website's policy with regard to sharing such personal information with third party entities.
          </p>

          <p>
            The terms "We"/ "Us"/ "Our" individually and collectively refer to and are synonymous with the term ' Ace2Examz' and the terms "You" / "Your" / "Yourself" are to be construed to be synonymous with the term 'User'. All defined terms used within this Policy but not specifically defined herein shall draw their meaning from the definition ascribed to such term under the T&C.
          </p>

          {/* Section 1 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">1.</span> COLLECTION OF INFORMATION
            </h2>
            <p className="mb-4">
              Ace2Examz may during the course of the User's usage of the Website collect the following personal and non-personal information and such other information from the Users for accessing the Website ("Information"), as part of the voluntary registration process, any on-line survey or interaction on the Website or combination thereof, as may be required from time to time. The Information shall be collected in order to conduct operations on the Website. The Website collects or can request for the below mentioned Information from the Users:
            </p>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3">1.1 Personal Information:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Name of the User</li>
              <li>Phone number (mobile and/or residence and/or alternative) of the User</li>
              <li>Date of birth of the User</li>
              <li>Email Id (primary/alternative) of the User</li>
              <li>Personal information received from social networking sites through which the User has registered to the Website including name, profile picture, email address or friends list, and any information made public in connection with that social media service</li>
              <li>Personal information from the mobile device of the User such as their contact list including the name, phone number and the email address of the contact</li>
            </ul>

            <h3 className="text-xl font-semibold text-cyan-400 mb-3">1.2 Non-personal information:</h3>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>Details of internet or telecom service provider of the User</li>
              <li>Location of a User</li>
              <li>Type of internet browser being used by the User</li>
              <li>Such other information that may be required to access and operate the Website</li>
            </ul>

            <p className="mb-2"><strong>1.3</strong> Please note that in addition to the above, the duration of use of the Website by the User may also be logged and stored by the Website.</p>
            <p className="mb-2"><strong>1.4</strong> The Information may be collected and/or stored in electronic form, however, Ace2Examz is hereby authorized by the User to collect/store such information in physical form as well.</p>
            <p><strong>1.5</strong> The Website may share the Information of a User with any third party entities subject to such entities adopting reasonable safety standards with respect to the use of such Information.</p>
          </div>

          {/* Section 2 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">2.</span> REPRESENTATION AND WARRANTIES
            </h2>
            <p className="mb-3">Every User hereby represents and warrants to Ace2Examz that:</p>
            <ul className="list-disc list-inside space-y-2 mb-4 ml-4">
              <li>all Information provided by the User is true, correct, current and updated</li>
              <li>all Information provided by the User and the provision of such Information by the User does not in any manner violate any third party agreement, law, decree, order or judgement</li>
              <li>all Information provided by the User does not belong to any third party, and if it does belong to a third party, the User is duly authorized by such Third Party to use, access and disseminate such Information</li>
            </ul>

            <p className="mb-3">Ace2Examz represents and warrants to every User that:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>it shall not collect the User's sensitive personal data unless such sensitive personal data is collected for a lawful purpose for which such collection of data is necessary</li>
              <li>it shall not retain any sensitive personal data for longer than such sensitive personal data is required or can be lawfully used</li>
              <li>in the event Ace2Examz collects Information directly from the User, Ace2Examz shall make reasonable effort to apprise the User of the purpose of such collection of Information, the intended recipient of the Information and the details of the agencies collecting and retaining the Information</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">3.</span> PURPOSE AND USE OF INFORMATION
            </h2>
            <p className="mb-3">All Information collected/stored by the Website shall be used for:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>providing information about new educational products and services to the Users</li>
              <li>to continually improve the existing Website and service offerings</li>
              <li>to conduct research and surveys</li>
              <li>to implement the necessary security practices to ensure that all personal data are protected</li>
              <li>to administer the User accounts in normal course of business</li>
              <li>to contact the Users in case where fraud, illegal activities or breach of privacy is recorded</li>
              <li>to enable the employees of or persons acting on behalf of Ace2Examz to communicate with the User, as and when necessary, in order to provide the services requested by such User</li>
              <li>such other purposes that Ace2Examz, at its sole discretion, however subject to the principles contained in this Policy, may deem fit</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">4.</span> SHARING OF INFORMATION
            </h2>
            <p>
              <strong>4.1</strong> Every User hereby expressly agrees that Ace2Examz may share the Information collected from such User with its affiliates, employees, and such other individuals and institutions located within or outside India from time to time to ensure efficient management of Website traffic, to detect and prevent identity theft and other illegal acts, and to respond to legal, judicial, quasi-judicial law enforcement agencies or in connection with an investigation on matters related to public safety, as required and permitted by law and for such other purposes that Ace2Examz may deem fit from time to time.
            </p>
          </div>

          {/* Section 5 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">5.</span> DATA RETENTION
            </h2>
            <p className="mb-3">
              <strong>5.1</strong> Ace2Examz shall retain Information for as long as is reasonably necessary in relation to the purposes for which this data was collected. In many instances, Ace2Examz shall retain Information that is necessary for operation of the Website by the User, which may include maintaining this Information beyond when the User ceases using the Website.
            </p>
            <p>
              <strong>5.2</strong> However, all Information pertaining to chats and student side test attempts shall only be retained by Ace2Examz for a period of 2 years from date of receipt of such Information, after which such Information shall be automatically erased from the Ace2Examz servers and databases.
            </p>
          </div>

          {/* Section 6 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">6.</span> COOKIES AND THIRD PARTY WEBSITE LINKS
            </h2>
            <p className="mb-3">
              The Website sends cookies (small files containing a string of characters) to your computer, thereby uniquely identifying your browser. Cookies are used to track your preferences, help you login faster, and aggregated to determine user trends. This data is used to improve offerings, such as providing more content in areas of greater interest to a majority of users.
            </p>
            <p>
              Most browsers are initially set up to accept cookies, but you can reset your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </div>

          {/* Section 7 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">7.</span> PROTECTION OF INFORMATION
            </h2>
            <div className="space-y-3">
              <p><strong>7.1</strong> Ace2Examz understands and acknowledges the importance of security and protection of the Information provided by and/or collected from the Users. Pursuant to the same, Ace2Examz shall make the best efforts to ensure protection of Information by use of such security measures and programs that it may deem fit for the purpose. We shall employ best efforts to protect the Information against any unauthorised, illegal and fraudulent use of such Information by third parties.</p>
              
              <p><strong>7.2</strong> Notwithstanding anything to the contrary, Ace2Examz shall not be held responsible for any loss, damage or misuse of the Information caused to the User, if such loss, damage or misuse is attributable to an event beyond the control of or attributable to Ace2Examz or a force majeure event.</p>
              
              <p><strong>7.3</strong> Ace2Examz shall ensure that the Website shall adopt appropriate encryption and security measures to prevent any hacking of the information of the Users and third parties and shall ensure that the User shall not be required or asked to disclose any Information, which may be prejudicial to the interests of the User. Currently, the content available on the Website is encrypted with AES 256 encryption where the data transfers are secured with HTTPS secured protocols and video content is delivered through HLS protocols.</p>
              
              <p><strong>7.4</strong> Ace2Examz shall use the Information collected from the Users in accordance with applicable laws including but not limited to the IT Act and the rules made thereunder and use the Information only for the purpose for which it was furnished.</p>
              
              <p><strong>7.5</strong> Ace2Examz has appropriate physical, electronic and managerial procedures in relation to the Website. The servers of the Website are accessible only to the authorised personnel and any Information of the User shall be shared with the authorised personnel only on a need to know basis to facilitate the services requested by the User. Ace2Examz shall endeavour to safeguard the confidentiality of a User's personally identifiable information, however, the transmissions made by means of the Internet cannot be made absolutely secure by the Website. The User agrees and acknowledges that Ace2Examz shall not be liable for disclosure of any information due to errors in transmission or any unauthorised acts of third parties.</p>
              
              <p><strong>7.6</strong> The User agrees and acknowledges that Ace2Examz shall be entitled to share the Information where such sharing is necessary for the lawful performance of the contractual obligations existing between Ace2Examz and the User and for such purposes as it may deem fit, however, the disclosure of Information shall be in accordance with this Policy, the IT Act and the rules made thereunder.</p>
            </div>
          </div>

          {/* Section 8 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">8.</span> OPTION TO OPT-OUT AND WITHDRAWAL OF INFORMATION
            </h2>
            <p>
              <strong>8.1</strong> The User has the option of not providing its Information to Ace2Examz. Further, Information provided and/or collected by Ace2Examz may be withdrawn at any time during or pursuant to usage of the Website by a User. Users desirous of withdrawing the Information shall send an email to the grievance officer and request for such withdrawal. Ace2Examz may, subsequent to such withdrawal of information, at its sole discretion continue or discontinue the provision of its services to such User.
            </p>
          </div>

          {/* Section 9 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">9.</span> GRIEVANCE REDRESSAL
            </h2>
            <p className="mb-4">
              The User may report violation of breach of privacy, Information or identify theft or grievances in relation to the Information shared, collected, stored or disseminated by Ace2Examz in relation to the Website, to the grievance officer. The details of the grievance officer are as below:
            </p>
            <div className="bg-gray-800/50 rounded-lg p-6 space-y-2">
              <p><strong className="text-cyan-400">Grievance Redressal</strong></p>
              <p>Attn: Naveen Kumar</p>
              <p>Address: Chhota Tiwana Rd, Jalalabad West, Distt - Fazilka (PB), 152024</p>
              <p>Phone Number: <a href="tel:+919115179935" className="text-cyan-400 hover:text-cyan-300">+91-9115179935</a></p>
              <p>E-mail Address: <a href="mailto:crack@ace2examz.in" className="text-cyan-400 hover:text-cyan-300">crack@ace2examz.in</a></p>
            </div>
          </div>

          {/* Section 10 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">10.</span> UPDATION OF POLICY
            </h2>
            <p>
              Ace2Examz reserves the right to change or update this Policy at any time. The User shall be notified of any change to the Policy having the effect of curtailing or limiting the existing User rights under the Policy. Any such changes or updation of the Policy shall be immediately effective upon posting to the Website and your continued use is deemed approval of all such changes.
            </p>
          </div>

          {/* Section 11 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">11.</span> GOVERNING LAW AND JURISDICTION
            </h2>
            <p className="mb-3">
              In the event of any dispute arising between the parties with respect to this Policy, the same shall be referred to the sole arbitrator and the arbitration shall be in accordance with Arbitration and Conciliation Act of 1996. The language of arbitration proceedings shall be English. The seat and place of arbitration shall be New Delhi, India and the decision of the Arbitrator shall be final and binding on both parties herein.
            </p>
            <p>
              This contract shall be subject to the exclusive jurisdiction of courts in New Delhi, India and shall be governed by the Indian laws.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="text-cyan-400">12.</span> USE OF THE WEBSITE BY CHILDREN
            </h2>
            <p className="mb-3">
              To register on the website, you must meet the Age Requirements specified hereinbelow. If you are a 'Minor' or 'Child', i.e., an individual who does not meet the Age Requirements, then you may not register on the website, and only your parent can register on your behalf, agree to all website Terms and Conditions and enable access to you under their guidance and supervision.
            </p>
            <p className="mb-3">
              While some of our services may require collection of a Minor or Child's personal information, we do not knowingly collect such personal information. In the event a Minor or Child utilizes the website, it is assumed that he / she has obtained the consent of the parent / legal guardian and such use is made available by the parents or legal guardian.
            </p>
            <p className="mb-3">
              Ace2Examz will not be responsible for any consequences that arise as a result of misuse of our website, that may occur by virtue of any person including a Minor or Child registering on the website. Ace2Examz reserves the right to terminate your subscription and / or refuse to provide you with access to the website if it is discovered that you do not meet the Age Requirements and the consent to use the website is not given by your parent / legal guardian. We will also take necessary steps to remove such information from our servers.
            </p>
            <p className="mb-3">
              If you are a parent / legal guardian and you are aware that your child has provided us with personal information without your consent, please contact us at <a href="mailto:crack@ace2examz.in" className="text-cyan-400 hover:text-cyan-300">crack@ace2examz.in</a>.
            </p>
            <p className="mb-4">
              If your Child faces bullying, abuse or harassment while availing our Services, please contact us at <a href="mailto:crack@ace2examz.in" className="text-cyan-400 hover:text-cyan-300">crack@ace2examz.in</a>.
            </p>
            <div className="bg-pink-900/20 border-l-4 border-pink-500 p-4 rounded">
              <p className="font-semibold text-pink-400 mb-2">Age Requirements to register and use the website ("Age Requirements"):</p>
              <p>If you are a resident of India, then you must have attained at least eighteen (18) years of age, to register and use the website, or else act under parental consent.</p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg p-6 mt-8 border border-cyan-500/30">
            <h3 className="text-xl font-bold text-white mb-3">
              <i className="fas fa-envelope mr-2 text-cyan-400"></i>
              Questions About Privacy?
            </h3>
            <p className="mb-4">If you have any questions or concerns about our Privacy Policy, please don't hesitate to contact us:</p>
            <a href="mailto:crack@ace2examz.in" className="inline-block bg-cyan-500 text-black font-bold px-6 py-3 rounded-lg hover:bg-cyan-400 transition">
              Contact Us
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
