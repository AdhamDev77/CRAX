// scripts/create-default-templates.ts

import prisma from './lib/prisma';

const defaultTemplates = [
  {
    name: 'Doctor Template',
    prof: 'doctor',
    content: {
      content: [
        {
          type: 'Heading',
          props: { text: 'Welcome to My Medical Practice' }
        },
        {
          type: 'Paragraph',
          props: { text: 'I am a dedicated healthcare profal committed to providing excellent patient care.' }
        },
        {
          type: 'Button',
          props: { text: 'Book an Appointment' }
        }
      ]
    }
  },
  {
    name: 'Engineer Template',
    prof: 'engineer',
    content: {
      content: [
        {
          type: 'Heading',
          props: { text: 'Engineering Solutions' }
        },
        {
          type: 'Paragraph',
          props: { text: 'Innovative engineering services for complex problems.' }
        },
        {
          type: 'Button',
          props: { text: 'View Projects' }
        }
      ]
    }
  },
  {
    name: 'Software House Template',
    prof: 'software_house',
    content: {
      content: [
        {
          type: 'Heading',
          props: { text: 'Custom Software Development' }
        },
        {
          type: 'Paragraph',
          props: { text: 'We create tailored software solutions to drive your business forward.' }
        },
        {
          type: 'Button',
          props: { text: 'Get a Quote' }
        }
      ]
    }
  }
];

async function createDefaultTemplates() {
  for (const template of defaultTemplates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
  }
  console.log('Default templates created successfully');
}

createDefaultTemplates()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });