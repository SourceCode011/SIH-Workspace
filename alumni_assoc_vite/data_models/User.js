// file: data_models/User.js

class User {
    constructor(
        bio = null,
        contact_num = null,
        current_location = null,
        domain = null,
        email = null,
        enrollment_num = null,
        full_name = null,
        graduation_year = null,
        id_proof_url = null,
        is_complete = false,
        is_verified = false,
        pf_pic_url = null,
        posts = [],
        type = null,
        user_id = null,
        user_name = null,
        workplace = null,
        year_of_study = null
    ) {
        this.bio = bio;
        this.contact_num = contact_num;
        this.current_location = current_location;
        this.domain = domain;
        this.email = email;
        this.enrollment_num = enrollment_num;
        this.full_name = full_name;
        this.graduation_year = graduation_year;
        this.id_proof_url = id_proof_url;
        this.is_complete = is_complete;
        this.is_verified = is_verified;
        this.pf_pic_url = pf_pic_url;
        this.posts = posts;
        this.type = type;
        this.user_id = user_id;
        this.user_name = user_name;
        this.workplace = workplace;
        this.year_of_study = year_of_study;
    }

    // Getter and Setter for bio
    get bio() {
        return this.bio;
    }

    set bio(bio) {
        this.bio = bio;
    }

    // Getter and Setter for contact_num
    get contact_num() {
        return this.contact_num;
    }

    set contact_num(contact_num) {
        this.contact_num = contact_num;
    }

    // Getter and Setter for current_location
    get current_location() {
        return this.current_location;
    }

    set current_location(current_location) {
        this.current_location = current_location;
    }

    // Getter and Setter for domain
    get domain() {
        return this.domain;
    }

    set domain(domain) {
        this.domain = domain;
    }

    // Getter and Setter for email
    get email() {
        return this.email;
    }

    set email(email) {
        this.email = email;
    }

    // Getter and Setter for enrollment_num
    get enrollment_num() {
        return this.enrollment_num;
    }

    set enrollment_num(enrollment_num) {
        this.enrollment_num = enrollment_num;
    }

    // Getter and Setter for full_name
    get full_name() {
        return this.full_name;
    }

    set full_name(full_name) {
        this.full_name = full_name;
    }

    // Getter and Setter for graduation_year
    get graduation_year() {
        return this.graduation_year;
    }

    set graduation_year(graduation_year) {
        this.graduation_year = graduation_year;
    }

    // Getter and Setter for id_proof_url
    get id_proof_url() {
        return this.id_proof_url;
    }

    set id_proof_url(id_proof_url) {
        this.id_proof_url = id_proof_url;
    }

    // Getter and Setter for is_complete
    get is_complete() {
        return this.is_complete;
    }

    set is_complete(is_complete) {
        this.is_complete = is_complete;
    }

    // Getter and Setter for is_verified
    get is_verified() {
        return this.is_verified;
    }

    set is_verified(is_verified) {
        this.is_verified = is_verified;
    }

    // Getter and Setter for pf_pic_url
    get pf_pic_url() {
        return this.pf_pic_url;
    }

    set pf_pic_url(pf_pic_url) {
        this.pf_pic_url = pf_pic_url;
    }

    // Getter and Setter for posts
    get posts() {
        return this.posts;
    }

    set posts(posts) {
        this.posts = posts;
    }

    // Getter and Setter for type
    get type() {
        return this.type;
    }

    set type(type) {
        this.type = type;
    }

    // Getter and Setter for user_id
    get user_id() {
        return this.user_id;
    }

    set user_id(user_id) {
        this.user_id = user_id;
    }

    // Getter and Setter for user_name
    get user_name() {
        return this.user_name;
    }

    set user_name(user_name) {
        this.user_name = user_name;
    }

    // Getter and Setter for workplace
    get workplace() {
        return this.workplace;
    }

    set workplace(workplace) {
        this.workplace = workplace;
    }

    // Getter and Setter for year_of_study
    get year_of_study() {
        return this.year_of_study;
    }

    set year_of_study(year_of_study) {
        this.year_of_study = year_of_study;
    }

    // Override the toString() method to return the username
    toString() {
        return this.user_name;
    }
}

export default User;