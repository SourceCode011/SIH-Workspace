class ValidationUtils {
  // Check if the email is valid
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email != null && emailRegex.test(email);
  }

  // Check if the password meets length or complexity criteria
  static isValidPassword(password) {
    return password != null && password.length >= 6;
  }

  // Check if the username is valid
  static isValidUsername(username) {
    return username != null && username.trim().length > 0;
  }

  // Check if the bio is valid
  static isValidBio(bio) {
    return bio != null && bio.trim().length > 0;
  }

  // Check if the contact number is valid
  static isValidContactNum(contactNum) {
    const contactNumRegex = /^\d{10}$/;
    return contactNum != null && contactNumRegex.test(contactNum);
  }

  // Check if the domain is valid
  static isValidDomain(domain) {
    return domain != null && domain.trim().length > 0;
  }

  // Check if the enrollment number is valid
  static isValidEnrollmentNum(enrollmentNum) {
    return enrollmentNum != null && enrollmentNum.trim().length > 0;
  }

  // Check if the full name is valid
  static isValidFullName(fullName) {
    return fullName != null && fullName.trim().length > 0;
  }

  // Check if the graduation year is valid
  static isValidGraduationYear(graduationYear) {
    const graduationYearRegex = /^\d{4}$/;
    return graduationYear != null && graduationYearRegex.test(graduationYear);
  }

  // Check if the ID proof URL is valid
  static isValidIdProofUrl(idProofUrl) {
    const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
    return idProofUrl != null && urlRegex.test(idProofUrl);
  }

  // Check if the profile picture URL is valid
  static isValidPfPicUrl(pfPicUrl) {
    const urlRegex = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/;
    return pfPicUrl != null && urlRegex.test(pfPicUrl);
  }

  // Check if the workplace is valid
  static isValidWorkplace(workplace) {
    return workplace != null && workplace.trim().length > 0;
  }

  // Check if the year of study is valid
  static isValidYearOfStudy(yearOfStudy) {
    const yearOfStudyRegex = /^Year \d$/;
    return yearOfStudy != null && yearOfStudyRegex.test(yearOfStudy);
  }

  // Check if the event title is valid
  static isValidTitle(title) {
    return title != null && title.trim().length > 0;
  }

  // Check if the location is valid
  static isValidLocation(location) {
    return location != null && location.trim().length > 0;
  }

  // Check if the required skill is valid
  static isValidRequiredSkill(requiredSkill) {
    return requiredSkill != null && requiredSkill.trim().length > 0;
  }

  // Check if the event description is valid
  static isValidDescription(description) {
    return description != null && description.trim().length > 0;
  }

  // Check if the event mode is valid
  static isValidMode(mode) {
    return (
      mode != null &&
      mode.trim().length > 0 &&
      (mode === "Online" || mode === "Offline")
    );
  }

  // Check if the event platform is valid
  static isValidPlatform(platform) {
    return platform != null && platform.trim().length > 0;
  }

  // Check if the event venue is valid
  static isValidVenue(venue) {
    return venue != null && venue.trim().length > 0;
  }

  // Check if the caption is valid
  static isValidCaption(caption) {
    return caption != null && caption.trim().length > 0;
  }

  // Validate if the salary is a valid number and not empty
  static isValidSalary(salary) {
    if (salary == null || salary.trim().length === 0) {
      return false;
    }
    const parsedSalary = parseFloat(salary);
    return !isNaN(parsedSalary) && parsedSalary > 0; // Salary should be a positive number
  }

  // Validate if job mode is not null and not empty
  static isValidJobMode(jobMode) {
    return jobMode != null && jobMode.trim().length > 0;
  }
}

export default ValidationUtils;
