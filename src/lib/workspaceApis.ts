import {
  ClientDiagnosticInput,
  ColorToneProfile,
  ContrastLevel,
  LipCarePrescription,
  LipFinishPreference,
  LipHydration,
  LipSensitivity,
  SkinDepth,
  Undertone,
} from './colorAndLipData';

const FORMS_BASE = 'https://forms.googleapis.com/v1/forms';
const SLIDES_BASE = 'https://slides.googleapis.com/v1/presentations';

export interface FormQuestionSummary {
  questionId: string;
  title: string;
  itemId: string;
}

export interface WorkspaceFormInfo {
  formId: string;
  title: string;
  description?: string;
  responderUri?: string;
  editUri: string;
  questions: FormQuestionSummary[];
}

export interface WorkspaceFormResponseRow {
  responseId: string;
  submittedAt: string;
  answers: Record<string, string>;
  clientName: string;
}

export interface WorkspaceDeckInfo {
  presentationId: string;
  title: string;
  slideCount: number;
  editUri: string;
  slideSummaries: { objectId: string; previewText: string }[];
}

export function extractFormId(rawInput: string): string {
  const trimmed = rawInput.trim();
  const match = trimmed.match(/\/forms\/d\/(?:e\/)?([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
}

export function extractPresentationId(rawInput: string): string {
  const trimmed = rawInput.trim();
  const match = trimmed.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return trimmed;
}

async function parseGoogleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      data?.error?.message ||
      `Permintaan Google Workspace gagal (HTTP ${res.status}).`;
    throw new Error(message);
  }
  return data as T;
}

function parseFormPayload(data: any): WorkspaceFormInfo {
  const formId = data.formId as string;
  const items = Array.isArray(data.items) ? data.items : [];
  const questions: FormQuestionSummary[] = [];

  for (const item of items) {
    const questionId = item?.questionItem?.question?.questionId;
    if (questionId) {
      questions.push({
        questionId,
        title: item.title || 'Pertanyaan Tanpa Judul',
        itemId: item.itemId || questionId,
      });
    }
  }

  return {
    formId,
    title: data?.info?.title || 'Formulir Konsultasi GlossyChuu!',
    description: data?.info?.description,
    responderUri: data?.responderUri,
    editUri: `https://docs.google.com/forms/d/${encodeURIComponent(formId)}/edit`,
    questions,
  };
}

export async function createConsultationIntakeForm(
  accessToken: string,
  clientLabel?: string
): Promise<WorkspaceFormInfo> {
  const formTitle = clientLabel?.trim()
    ? `Intake Color Analysis & Lip Balm GlossyChuu! — ${clientLabel.trim()}`
    : 'Intake Color Analysis & Lip Balm — GlossyChuu!';

  const created = await parseGoogleResponse<any>(
    await fetch(FORMS_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        info: {
          title: formTitle,
          documentTitle: formTitle,
        },
      }),
    })
  );

  const safeFormId = encodeURIComponent(String(created.formId).trim());

  const batchBody = {
    includeFormInResponse: true,
    requests: [
      {
        updateFormInfo: {
          info: {
            description:
              'Kuesioner pra-konsultasi GlossyChuu! untuk memetakan hasil color analysis serta memilih warna dan tekstur lip balm alami yang cocok.',
          },
          updateMask: 'description',
        },
      },
      {
        createItem: {
          item: {
            title: 'Nama Klien',
            questionItem: {
              question: {
                required: true,
                textQuestion: { paragraph: false },
              },
            },
          },
          location: { index: 0 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Warna pembuluh darah nadi di pergelangan tangan (cahaya siang hari)',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Cenderung kehijauan / zaitun (Warm)' },
                    { value: 'Cenderung biru / ungu (Cool)' },
                    { value: 'Campuran biru dan hijau seimbang (Neutral)' },
                  ],
                },
              },
            },
          },
          location: { index: 1 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Tingkat kedalaman warna kulit (Skin Depth) & reaksi terhadap matahari',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Fair-Light (Cerah, mudah kemerahan)' },
                    { value: 'Medium (Kuning langsat hingga natural tan)' },
                    { value: 'Tan-Deep (Sawo matang hingga cokelat gelap)' },
                  ],
                },
              },
            },
          },
          location: { index: 2 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Kontras warna mata, rambut alami, dan perhiasan paling mencerahkan',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Lembut & selaras (Soft Contrast — Gold atau Silver lembut)' },
                    { value: 'Jernih & kontras cerah (Clear Contrast — Emas/Perak mengilap)' },
                    { value: 'Tegas & dalam (Rich Deep Contrast)' },
                  ],
                },
              },
            },
          },
          location: { index: 3 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Kondisi hidrasi & barrier bibir saat ini',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Sering kering, pecah-pecah, atau mengelupas (Dehidrasi)' },
                    { value: 'Cukup lembap namun sesekali kering di ruangan ber-AC (Normal)' },
                    { value: 'Lembap & halus sepanjang hari (Optimal)' },
                  ],
                },
              },
            },
          },
          location: { index: 4 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Sensitivitas bahan pada produk bibir',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Sensitif terhadap pewangi, mentol, atau pewarna sintetis' },
                    { value: 'Tidak ada riwayat alergi atau iritasi bibir' },
                  ],
                },
              },
            },
          },
          location: { index: 5 },
        },
      },
      {
        createItem: {
          item: {
            title: 'Hasil akhir warna bibir alami yang paling disukai',
            questionItem: {
              question: {
                required: true,
                choiceQuestion: {
                  type: 'RADIO',
                  options: [
                    { value: 'Sheer Balm (Transparan, berkilau sehat alami)' },
                    { value: 'Satin Mineral Tint (Warna lembut, tampilan rapi harian)' },
                    { value: 'Velvet Lip Balm (Pigmen kaya, menutup tepi bibir gelap)' },
                  ],
                },
              },
            },
          },
          location: { index: 6 },
        },
      },
    ],
  };

  const updated = await parseGoogleResponse<any>(
    await fetch(`${FORMS_BASE}/${safeFormId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(batchBody),
    })
  );

  return parseFormPayload(updated.form || created);
}

export async function getFormDetails(
  accessToken: string,
  rawFormId: string
): Promise<WorkspaceFormInfo> {
  const safeFormId = encodeURIComponent(extractFormId(rawFormId));
  const data = await parseGoogleResponse<any>(
    await fetch(`${FORMS_BASE}/${safeFormId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  );
  return parseFormPayload(data);
}

export async function getFormResponses(
  accessToken: string,
  rawFormId: string,
  questions: FormQuestionSummary[]
): Promise<WorkspaceFormResponseRow[]> {
  const safeFormId = encodeURIComponent(extractFormId(rawFormId));
  const data = await parseGoogleResponse<any>(
    await fetch(`${FORMS_BASE}/${safeFormId}/responses`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  );

  const rawResponses = Array.isArray(data.responses) ? data.responses : [];
  const titleByQId = new Map(questions.map((q) => [q.questionId, q.title]));

  return rawResponses.map((resp: any, idx: number) => {
    const answersMap: Record<string, string> = {};
    const answerEntries = resp.answers || {};
    let detectedName = `Klien #${idx + 1}`;

    for (const [qId, ansObj] of Object.entries<any>(answerEntries)) {
      const textValues =
        ansObj?.textAnswers?.answers?.map((a: any) => a.value).filter(Boolean) ||
        [];
      const joined = textValues.join(', ');
      const qTitle = titleByQId.get(qId) || qId;
      answersMap[qTitle] = joined;
      if (
        qTitle.toLowerCase().includes('nama') &&
        joined.trim().length > 0
      ) {
        detectedName = joined.trim();
      }
    }

    return {
      responseId: resp.responseId || `resp_${idx}`,
      submittedAt: resp.lastSubmittedTime || resp.createTime || '',
      answers: answersMap,
      clientName: detectedName,
    };
  });
}

export async function appendFollowUpQuestion(
  accessToken: string,
  rawFormId: string,
  questionTitle: string,
  insertIndex: number
): Promise<WorkspaceFormInfo> {
  const safeFormId = encodeURIComponent(extractFormId(rawFormId));
  const updated = await parseGoogleResponse<any>(
    await fetch(`${FORMS_BASE}/${safeFormId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        includeFormInResponse: true,
        requests: [
          {
            createItem: {
              item: {
                title: questionTitle.trim(),
                questionItem: {
                  question: {
                    required: false,
                    textQuestion: { paragraph: true },
                  },
                },
              },
              location: { index: Math.max(0, insertIndex) },
            },
          },
        ],
      }),
    })
  );

  return parseFormPayload(updated.form);
}

export function mapFormResponseToDiagnostic(
  row: WorkspaceFormResponseRow,
  current: ClientDiagnosticInput
): ClientDiagnosticInput {
  const fullText = Object.entries(row.answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join(' | ')
    .toLowerCase();

  let undertone: Undertone = current.undertone;
  if (fullText.includes('kehijauan') || fullText.includes('warm')) undertone = 'warm';
  else if (fullText.includes('ungu') || (fullText.includes('biru') && fullText.includes('cool'))) undertone = 'cool';
  else if (fullText.includes('neutral') || fullText.includes('seimbang')) undertone = 'neutral';

  let depth: SkinDepth = current.depth;
  if (fullText.includes('fair-light') || fullText.includes('cerah')) depth = 'light';
  else if (fullText.includes('tan-deep') || fullText.includes('sawo matang')) depth = 'deep';
  else if (fullText.includes('medium') || fullText.includes('langsat')) depth = 'medium';

  let contrast: ContrastLevel = current.contrast;
  if (fullText.includes('clear')) contrast = 'clear';
  else if (fullText.includes('rich')) contrast = 'rich';
  else if (fullText.includes('soft') || fullText.includes('lembut')) contrast = 'soft';

  let hydration: LipHydration = current.hydration;
  if (fullText.includes('dehidrasi') || fullText.includes('mengelupas')) hydration = 'dehydrated';
  else if (fullText.includes('optimal') || fullText.includes('halus')) hydration = 'plump';
  else if (fullText.includes('normal') || fullText.includes('ruangan ber-ac')) hydration = 'balanced';

  let sensitivity: LipSensitivity = current.sensitivity;
  if (fullText.includes('sensitif') || fullText.includes('alergi')) {
    sensitivity = fullText.includes('tidak ada riwayat') ? 'normal' : 'sensitive';
  }

  let finishPreference: LipFinishPreference = current.finishPreference;
  if (fullText.includes('sheer balm')) finishPreference = 'sheer-balm';
  else if (fullText.includes('velvet')) finishPreference = 'velvet-balm';
  else if (fullText.includes('satin')) finishPreference = 'satin-tint';

  return {
    ...current,
    clientName: row.clientName || current.clientName,
    undertone,
    depth,
    contrast,
    hydration,
    sensitivity,
    finishPreference,
    notes: `Diimpor dari Google Forms (${row.submittedAt ? row.submittedAt.slice(0, 10) : 'Terbaru'}).`,
  };
}

function hexToRgbFraction(hex: string): { red: number; green: number; blue: number } {
  const cleaned = hex.replace('#', '');
  const num = parseInt(cleaned, 16);
  if (Number.isNaN(num)) return { red: 0.78, green: 0.24, blue: 0.45 };
  return {
    red: ((num >> 16) & 255) / 255,
    green: ((num >> 8) & 255) / 255,
    blue: (num & 255) / 255,
  };
}

function makeTextBoxRequests(
  objectId: string,
  pageObjectId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  fontSizePt: number,
  colorHex: string,
  bold = false
): any[] {
  return [
    {
      createShape: {
        objectId,
        shapeType: 'TEXT_BOX',
        elementProperties: {
          pageObjectId,
          size: {
            width: { magnitude: w, unit: 'PT' },
            height: { magnitude: h, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: x,
            translateY: y,
            unit: 'PT',
          },
        },
      },
    },
    {
      insertText: {
        objectId,
        text,
      },
    },
    {
      updateTextStyle: {
        objectId,
        textRange: { type: 'ALL' },
        style: {
          fontSize: { magnitude: fontSizePt, unit: 'PT' },
          bold,
          foregroundColor: {
            opaqueColor: { rgbColor: hexToRgbFraction(colorHex) },
          },
          fontFamily: 'Nunito',
        },
        fields: 'fontSize,bold,foregroundColor,fontFamily',
      },
    },
  ];
}

function makeSwatchRectRequests(
  objectId: string,
  pageObjectId: string,
  x: number,
  y: number,
  w: number,
  h: number,
  fillHex: string
): any[] {
  return [
    {
      createShape: {
        objectId,
        shapeType: 'ROUND_RECTANGLE',
        elementProperties: {
          pageObjectId,
          size: {
            width: { magnitude: w, unit: 'PT' },
            height: { magnitude: h, unit: 'PT' },
          },
          transform: {
            scaleX: 1,
            scaleY: 1,
            translateX: x,
            translateY: y,
            unit: 'PT',
          },
        },
      },
    },
    {
      updateShapeProperties: {
        objectId,
        shapeProperties: {
          shapeBackgroundFill: {
            solidFill: {
              color: { rgbColor: hexToRgbFraction(fillHex) },
            },
          },
          outline: { propertyState: 'NOT_RENDERED' },
        },
        fields: 'shapeBackgroundFill.solidFill.color,outline',
      },
    },
  ];
}

function parsePresentationSummary(data: any): WorkspaceDeckInfo {
  const presentationId = String(data.presentationId || '');
  const slides = Array.isArray(data.slides) ? data.slides : [];
  const slideSummaries = slides.map((slide: any, idx: number) => {
    const texts: string[] = [];
    for (const el of slide.pageElements || []) {
      const elems = el?.shape?.text?.textElements || [];
      for (const te of elems) {
        if (te?.textRun?.content) {
          texts.push(te.textRun.content.trim());
        }
      }
    }
    const joined = texts.filter(Boolean).join(' · ');
    return {
      objectId: slide.objectId || `slide_${idx}`,
      previewText: joined.slice(0, 140) || `Slide ${idx + 1}`,
    };
  });

  return {
    presentationId,
    title: data.title || 'Dek Konsultasi GlossyChuu!',
    slideCount: slides.length,
    editUri: `https://docs.google.com/presentation/d/${encodeURIComponent(presentationId)}/edit`,
    slideSummaries,
  };
}

export async function createConsultationDeck(
  accessToken: string,
  input: ClientDiagnosticInput,
  toneProfile: ColorToneProfile,
  lipCare: LipCarePrescription
): Promise<WorkspaceDeckInfo> {
  const labelName = input.clientName.trim() || 'Klien GlossyChuu!';
  const deckTitle = `GlossyChuu! Lookbook Color Analysis & Lip Care — ${labelName} (${toneProfile.toneName})`;

  const created = await parseGoogleResponse<any>(
    await fetch(SLIDES_BASE, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title: deckTitle }),
    })
  );

  const presentationId = String(created.presentationId);
  const safeId = encodeURIComponent(presentationId.trim());
  const defaultSlideId = created?.slides?.[0]?.objectId;

  const stamp = Date.now().toString(36);
  const s1 = `s1_${stamp}`;
  const s2 = `s2_${stamp}`;
  const s3 = `s3_${stamp}`;
  const s4 = `s4_${stamp}`;

  const requests: any[] = [
    {
      createSlide: {
        objectId: s1,
        insertionIndex: 0,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createSlide: {
        objectId: s2,
        insertionIndex: 1,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createSlide: {
        objectId: s3,
        insertionIndex: 2,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      createSlide: {
        objectId: s4,
        insertionIndex: 3,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
  ];

  if (defaultSlideId) {
    requests.push({ deleteObject: { objectId: defaultSlideId } });
  }

  for (const sid of [s1, s2, s3, s4]) {
    requests.push({
      updatePageProperties: {
        objectId: sid,
        pageProperties: {
          pageBackgroundFill: {
            solidFill: { color: { rgbColor: hexToRgbFraction('#FFF8FB') } },
          },
        },
        fields: 'pageBackgroundFill.solidFill.color',
      },
    });
  }

  // SLIDE 1: Cover
  requests.push(
    ...makeSwatchRectRequests(`accent_bar_${stamp}`, s1, 56, 68, 48, 4, '#C83E72'),
    ...makeTextBoxRequests(
      `cover_kicker_${stamp}`,
      s1,
      56,
      82,
      500,
      24,
      `${input.consultantName} · Laporan Konsultasi Personal`,
      11,
      '#75485D',
      true
    ),
    ...makeTextBoxRequests(
      `cover_title_${stamp}`,
      s1,
      56,
      118,
      600,
      78,
      `${labelName}\n${toneProfile.toneName}`,
      30,
      '#3D2230',
      true
    ),
    ...makeTextBoxRequests(
      `cover_sub_${stamp}`,
      s1,
      56,
      212,
      560,
      64,
      `${toneProfile.headline}\n${toneProfile.description}`,
      12,
      '#5C3648',
      false
    ),
    ...makeTextBoxRequests(
      `cover_meta_${stamp}`,
      s1,
      56,
      328,
      600,
      36,
      `Tanggal Sesi: ${input.sessionDate} · Logam Ideal: ${toneProfile.jewelryMetal}`,
      10,
      '#75485D',
      false
    )
  );

  // SLIDE 2: Personal Color Palette (6 Swatches)
  requests.push(
    ...makeTextBoxRequests(
      `s2_title_${stamp}`,
      s2,
      48,
      32,
      620,
      36,
      `Palet Warna Personal: ${toneProfile.toneName}`,
      20,
      '#3D2230',
      true
    ),
    ...makeTextBoxRequests(
      `s2_sub_${stamp}`,
      s2,
      48,
      66,
      620,
      28,
      `Tekstur Kain: ${toneProfile.fabricFinish} · Logam: ${toneProfile.jewelryMetal}`,
      10,
      '#75485D',
      false
    )
  );

  toneProfile.swatches.slice(0, 6).forEach((sw, idx) => {
    const col = idx % 3;
    const row = Math.floor(idx / 3);
    const x = 48 + col * 212;
    const y = 110 + row * 124;
    requests.push(
      ...makeSwatchRectRequests(`sw_box_${idx}_${stamp}`, s2, x, y, 192, 68, sw.hex),
      ...makeTextBoxRequests(
        `sw_lbl_${idx}_${stamp}`,
        s2,
        x,
        y + 72,
        192,
        40,
        `${sw.name} (${sw.hex})\n${sw.role}`,
        9.5,
        '#3D2230',
        false
      )
    );
  });

  // SLIDE 3: Natural Lip Shades (4 Lip Swatches)
  requests.push(
    ...makeTextBoxRequests(
      `s3_title_${stamp}`,
      s3,
      48,
      32,
      620,
      36,
      `Pilihan Warna Lip Balm Alami — ${labelName}`,
      20,
      '#3D2230',
      true
    ),
    ...makeTextBoxRequests(
      `s3_sub_${stamp}`,
      s3,
      48,
      66,
      620,
      24,
      `Disesuaikan untuk undertone ${input.undertone.toUpperCase()} dan preferensi akhir ${input.finishPreference}.`,
      10,
      '#75485D',
      false
    )
  );

  toneProfile.lipShades.slice(0, 4).forEach((lip, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const x = 48 + col * 316;
    const y = 108 + row * 134;
    requests.push(
      ...makeSwatchRectRequests(`lip_box_${idx}_${stamp}`, s3, x, y, 68, 92, lip.hex),
      ...makeTextBoxRequests(
        `lip_txt_${idx}_${stamp}`,
        s3,
        x + 80,
        y,
        220,
        110,
        `${lip.name} (${lip.hex})\n${lip.finish} · ${lip.occasion}\nPigmen: ${lip.naturalPigment}\n${lip.coverageNote}`,
        9,
        '#3D2230',
        false
      )
    );
  });

  // SLIDE 4: Lip Care Routine AM/PM
  const amText = lipCare.amRoutine
    .map((r) => `${r.step}. ${r.title}\n   ${r.detail}`)
    .join('\n');
  const pmText = lipCare.pmRoutine
    .map((r) => `${r.step}. ${r.title}\n   ${r.detail}`)
    .join('\n');
  const avoidText = lipCare.avoidIngredients
    .map((a) => `• ${a.name}`)
    .join('  ');

  requests.push(
    ...makeTextBoxRequests(
      `s4_title_${stamp}`,
      s4,
      48,
      28,
      620,
      36,
      `Rutinitas Perawatan Bibir Alami GlossyChuu!`,
      19,
      '#3D2230',
      true
    ),
    ...makeTextBoxRequests(
      `s4_status_${stamp}`,
      s4,
      48,
      64,
      620,
      36,
      `Status Barrier Bibir: ${lipCare.barrierStatus}`,
      10,
      '#C83E72',
      true
    ),
    ...makeTextBoxRequests(
      `s4_am_${stamp}`,
      s4,
      48,
      110,
      300,
      198,
      `RITUAL PAGI (AM)\n\n${amText}`,
      9.5,
      '#3D2230',
      false
    ),
    ...makeTextBoxRequests(
      `s4_pm_${stamp}`,
      s4,
      372,
      110,
      300,
      198,
      `PEMULIHAN MALAM (PM)\n\n${pmText}`,
      9.5,
      '#3D2230',
      false
    ),
    ...makeTextBoxRequests(
      `s4_avoid_${stamp}`,
      s4,
      48,
      324,
      624,
      54,
      `Mingguan: ${lipCare.weeklyRitual}\nHindari: ${avoidText}`,
      9,
      '#75485D',
      false
    )
  );

  await parseGoogleResponse<any>(
    await fetch(`${SLIDES_BASE}/${safeId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    })
  );

  return getPresentationDetails(accessToken, presentationId);
}

export async function getPresentationDetails(
  accessToken: string,
  rawPresentationId: string
): Promise<WorkspaceDeckInfo> {
  const safeId = encodeURIComponent(extractPresentationId(rawPresentationId));
  const data = await parseGoogleResponse<any>(
    await fetch(`${SLIDES_BASE}/${safeId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
  );
  return parsePresentationSummary(data);
}

export async function appendRoutineUpdateSlide(
  accessToken: string,
  rawPresentationId: string,
  input: ClientDiagnosticInput,
  toneProfile: ColorToneProfile,
  lipCare: LipCarePrescription
): Promise<WorkspaceDeckInfo> {
  const safeId = encodeURIComponent(extractPresentationId(rawPresentationId));
  const stamp = Date.now().toString(36);
  const slideId = `upd_${stamp}`;
  const labelName = input.clientName.trim() || 'Klien GlossyChuu!';

  const topShade = toneProfile.lipShades[0];
  const activesLine = lipCare.actives
    .map((a) => `• ${a.name} (${a.concentration}) — ${a.functionLabel}`)
    .join('\n');

  const requests: any[] = [
    {
      createSlide: {
        objectId: slideId,
        slideLayoutReference: { predefinedLayout: 'BLANK' },
      },
    },
    {
      updatePageProperties: {
        objectId: slideId,
        pageProperties: {
          pageBackgroundFill: {
            solidFill: { color: { rgbColor: hexToRgbFraction('#FFF8FB') } },
          },
        },
        fields: 'pageBackgroundFill.solidFill.color',
      },
    },
    ...makeTextBoxRequests(
      `upd_title_${stamp}`,
      slideId,
      48,
      36,
      620,
      42,
      `Pembaruan Catatan Konsultasi — ${labelName}`,
      20,
      '#3D2230',
      true
    ),
    ...makeSwatchRectRequests(
      `upd_swatch_${stamp}`,
      slideId,
      48,
      92,
      80,
      80,
      topShade.hex
    ),
    ...makeTextBoxRequests(
      `upd_body_${stamp}`,
      slideId,
      148,
      92,
      520,
      240,
      `Karakter Tone Warna: ${toneProfile.toneName} · Tanggal: ${input.sessionDate}\nShade Utama: ${topShade.name} (${topShade.hex}) — ${topShade.naturalPigment}\nStatus Bibir: ${lipCare.barrierStatus}\n\nBahan Aktif Rekomendasi:\n${activesLine}\n\nCatatan Tambahan: ${input.notes || '-'}`,
      10.5,
      '#3D2230',
      false
    ),
  ];

  await parseGoogleResponse<any>(
    await fetch(`${SLIDES_BASE}/${safeId}:batchUpdate`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ requests }),
    })
  );

  return getPresentationDetails(accessToken, rawPresentationId);
}

