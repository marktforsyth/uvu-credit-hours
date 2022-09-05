from bs4 import BeautifulSoup
import requests
import re
import json


def fetch_data():
    url = 'https://www.uvu.edu/catalog/current/courses'
    page = requests.get(url).text
    soup = BeautifulSoup(page, 'html.parser')

    courses = []
    for table in soup.find_all(class_='courses_table'):
        for link in table.find_all('a'):
            subject_page = requests.get(link.get('href')).text
            subject_soup = BeautifulSoup(subject_page, 'html.parser')

            courses += subject_soup.find_all(class_='course')

    return courses


def process_course(course):
    section_number = course.find(
        class_='section_number').get_text().split()
    title = course.find(class_='class_title').get_text()

    credit_text = course.find(class_='credits').get_text().split()
    if credit_text[1] == 'to':
        credits = [float(credit_text[0]), float(credit_text[2])]
    else:
        credits = [float(credit_text[0])]

    prereq_text = course.find_all(class_='prereq')
    if prereq_text:
        prereqs = [re.sub(r'\s+', ' ', prereq.get_text()).strip()
                   for prereq in prereq_text]
    else:
        prereqs = []

    description = re.sub(r'\s+', ' ', course.find('p').get_text()).strip()

    return {
        'sectionNumber': section_number,
        'title': title,
        'creditHours': credits,
        'prereqs': prereqs,
        'description': description
    }


def possible_values(raw_html):
    possible_subjects = []
    possible_credit_hours = []

    for course in raw_html:
        subjects = [course.find(
            class_='section_number').get_text().split()[0]]
        credit_text = course.find(class_='credits').get_text().split()

        if credit_text[1] == 'to':
            credits = [float(credit_text[0]), float(credit_text[2])]
        else:
            credits = [float(credit_text[0])]

        new_subjects = [
            subject for subject in subjects if subject not in possible_subjects]
        new_credit_hours = [
            float(credit) for credit in credits if float(credit) not in possible_credit_hours]

        possible_subjects += new_subjects
        possible_credit_hours += new_credit_hours

    return possible_subjects, possible_credit_hours


def main():
    raw_html = fetch_data()
    output = [process_course(course)
              for course in raw_html]
    possible_subjects, possible_credit_hours = possible_values(raw_html)

    with open('../uvu-credit-hours-tool/data/courses.json', 'w', encoding='utf-8') as courses:
        courses.write(json.dumps(output))

    with open('../uvu-credit-hours-tool/data/possible-subjects.json', 'w', encoding='utf-8') as possible_subjects_output:
        possible_subjects_output.write(json.dumps(possible_subjects))

    with open('../uvu-credit-hours-tool/data/possible-credit-hours.json', 'w', encoding='utf-8') as possible_credit_hours_output:
        possible_credit_hours_output.write(json.dumps(sorted(possible_credit_hours)))


if __name__ == '__main__':
    main()
