'use client'

import { Container, Card, Form, Row, Col, Dropdown, ButtonGroup, Image, Badge, Tooltip, OverlayTrigger } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"
import useDashboard from "@/hooks/useDashboard";
import { useState } from "react";
import { BSButton, ComingSoon, BSLink, Loader } from "@/components";
import { FaAngleDown } from "react-icons/fa6";
import { useTheme } from 'next-themes'
import { type Locale } from '@/i18n'
import '@/styles/ui/Roles.scss'
import Markdown from 'react-markdown'

type Props = {
  dict: Dictionary;
  lang: Locale;
}

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const DISCORD_TIMESTAMP_REGEX = /<t:(\d+)(?::([tTdDfFR]))?>/g;

function formatRelativeTime(date: Date, locale: string) {
  const diffInSeconds = Math.round((date.getTime() - Date.now()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  const ranges: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unit, secondsInUnit] of ranges) {
    if (Math.abs(diffInSeconds) >= secondsInUnit || unit === "second") {
      return rtf.format(Math.round(diffInSeconds / secondsInUnit), unit);
    }
  }

  return rtf.format(diffInSeconds, "second");
}

function formatDiscordTimestampTag(input: string, locale: string) {
  return input.replace(DISCORD_TIMESTAMP_REGEX, (match, unixRaw, styleRaw) => {
    const unixSeconds = Number(unixRaw);
    if (!Number.isFinite(unixSeconds)) return match;

    const style = (styleRaw || "f") as "t" | "T" | "d" | "D" | "f" | "F" | "R";
    const date = new Date(unixSeconds * 1000);
    if (Number.isNaN(date.getTime())) return match;

    switch (style) {
      case "t":
        return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit" });
      case "T":
        return date.toLocaleTimeString(locale, { hour: "numeric", minute: "2-digit", second: "2-digit" });
      case "d":
        return date.toLocaleDateString(locale, { year: "numeric", month: "2-digit", day: "2-digit" });
      case "D":
        return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
      case "f":
        return date.toLocaleString(locale, {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: false
        });
      case "F":
        return date.toLocaleString(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        });
      case "R":
        return formatRelativeTime(date, locale);
      default:
        return match;
    }
  });
}

export default function CardDashboard({ dict, lang }: Props) {
  const { data, loading, error, success, status, sendAnnouncement, sendError, sendEmbed, clearFeedback } = useDashboard(dict);
  const { resolvedTheme } = useTheme();

  const dashboardDict = dict.drivershub.dashboard.dashboard;

  /* --- EMBED --- */
  const [embedWebhookUsername, setEmbedWebhookUsername] = useState('');
  const [embedWebhookUsernameIcon, setEmbedWebhookUsernameIcon] = useState('');
  const [embedAuthor, setEmbedAuthor] = useState('');
  const [embedAuthorIcon, setEmbedAuthorIcon] = useState('');
  const [embedTitle, setEmbedTitle] = useState('');
  const [embedTitleUrl, setEmbedTitleUrl] = useState('');
  const [embedMessage, setEmbedMessage] = useState('');

  /* --- ERROR --- */
  const [errorWebhookUsername, setErrorWebhookUsername] = useState('');
  const [errorWebhookUsernameIcon, setErrorWebhookUsernameIcon] = useState('');
  const [errorEmbedAuthor, setErrorEmbedAuthor] = useState('');
  const [errorEmbedAuthorIcon, setErrorEmbedAuthorIcon] = useState('');
  const [errorEmbedTitle, setErrorEmbedTitle] = useState('');
  const [errorEmbedTitleUrl, setErrorEmbedTitleUrl] = useState('');
  const [errorEmbedRequestUrl, setErrorEmbedRequestUrl] = useState('');
  const [errorEmbedMethod, setErrorEmbedMethod] = useState('');
  const [errorEmbedHTTPStatus, setErrorEmbedHTTPStatus] = useState('');
  const [errorEmbedMessage, setErrorEmbedMessage] = useState('');

  /* --- ANNOUNCEMENT --- */
  const [announcementWebhookUsername, setAnnouncementWebhookUsername] = useState('');
  const [announcementWebhookUsernameIcon, setAnnouncementWebhookUsernameIcon] = useState('');
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMentionTag, setAnnouncementMentionTag] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementFooter, setAnnouncementFooter] = useState('');
  const [announcementFooterRoleTag, setAnnouncementFooterRoleTag] = useState<string | null>(null);
  const [announcementFooterEmojiTag, setAnnouncementFooterEmojiTag] = useState<string | null>(null);

  const [formError, setFormError] = useState<string | null>(null);

  const [embedFormMessageError, setEmbedFormMessageError] = useState<string | null>(null);

  const [errorFormRequestUrlError, setErrorFormRequestUrlError] = useState<string | null>(null);
  const [errorFormMethodError, setErrorFormMethodError] = useState<string | null>(null);
  const [errorFormHTTPStatusError, setErrorFormHTTPStatusError] = useState<string | null>(null);
  const [errorFormMessageError, setErrorFormMessageError] = useState<string | null>(null);

  const [announcementFormMentionTagError, setAnnouncementFormMentionTagError] = useState<string | null>(null);
  const [announcementFormTitleError, setAnnouncementFormTitleError] = useState<string | null>(null);
  const [announcementFormFooterError, setAnnouncementFormFooterError] = useState<string | null>(null);
  const [announcementFormMessageError, setAnnouncementFormMessageError] = useState<string | null>(null);

  const [messageType, setMessageType] = useState<"embed" | "error" | "announcement" | null>(null);

  const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isEmojiDropdownOpen, setIsEmojiDropdownOpen] = useState(false);

  const methods = [
    { method: "GET" },
    { method: "POST" },
    { method: "PUT" },
    { method: "PATCH" },
    { method: "DELETE" }
  ];

  const announcementMentionTags = [
    { label: '👑 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '👑 Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '⚖️ Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '⚙️ Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: '🌐 Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', divider: true, color: 'theme', role_id: '1285559909060182026' },
    { label: '👥 Human Resources Director', color: 'hrd', role_id: '1282300994046394498' },
    { label: '👥 Human Resources', color: 'hr', role_id: '1282090397828382802' },
    { label: '📋 Recruitment Team Director', color: 'rtd', role_id: '1282301484788092979' },
    { label: '🎉 Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: '📸 Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: '🚧 Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', divider: true, color: 'theme', role_id: '1285585227091279883' },
    { label: '📋 Recruitment Team', color: 'rt', role_id: '1282091153910661170' },
    { label: '🎉 Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: '📸 Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: '🚧 Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: '🛡️ Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', divider: true, color: 'theme', role_id: '1285560716085952623' },
    { label: '🚚 Driver', color: 'driver', role_id: '1282026105238327317' },
    { label: '👤 Member', color: 'member', role_id: '1282224309741293610' },
    { label: '🔔 News Ping', color: 'ping', role_id: '1285587879896027187' },
    { label: 'everyone', color: 'blurple', role_id: 'everyone' },
  ];

  const announcementFooterRoleTags = [
    { label: '👑 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '👑 Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '⚖️ Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '⚙️ Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: '🌐 Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', divider: true, color: 'theme', role_id: '1285559909060182026' },
    { label: '👥 Human Resources Director', color: 'hrd', role_id: '1282300994046394498' },
    { label: '👥 Human Resources', color: 'hr', role_id: '1282090397828382802' },
    { label: '📋 Recruitment Team Director', color: 'rtd', role_id: '1282301484788092979' },
    { label: '🎉 Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: '📸 Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: '🚧 Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', divider: true, color: 'theme', role_id: '1285585227091279883' },
    { label: '📋 Recruitment Team', color: 'rt', role_id: '1282091153910661170' },
    { label: '🎉 Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: '📸 Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: '🚧 Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: '🛡️ Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', divider: true, color: 'theme', role_id: '1285560716085952623' },
  ];

  const announcementFooterEmojiTags = [
    { emoji_name: ':ppls_logo:', emoji_id: '1513842708316426311' },
    { emoji_name: ':peepo_ppls:', emoji_id: '1288526719992725577' },
    { emoji_name: ':Scania:', emoji_id: '1513844409765199942' },
    { emoji_name: ':peepo_love:', emoji_id: '1288523924094845030' },
    { emoji_name: ':ets2:', emoji_id: '1283513953439322132' },
  ];

  const statusToErrorName: Record<number, string> = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_ALLOWED",
    409: "CONFLICT",
    422: "UNPROCESSABLE_ENTITY",
    429: "TOO_MANY_REQUESTS",
    500: "INTERNAL_SERVER_ERROR",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT",
  };

  const selectedAnnouncementMentionTag = announcementMentionTags.find((tag) => tag.role_id === announcementMentionTag);
  const selectedFooterRoleTag = announcementFooterRoleTags.find((role) => role.role_id === announcementFooterRoleTag);
  const selectedFooterEmojiTag = announcementFooterEmojiTags.find((emoji) => emoji.emoji_id === announcementFooterEmojiTag);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearFeedback();
    setFormError(null);
    
    if (messageType === "error") {
      try {
        const errorsFormData = {
          username: errorWebhookUsername,
          avatar_url: errorWebhookUsernameIcon,
          errorAuthor: errorEmbedAuthor,
          errorAuthorIcon: errorEmbedAuthorIcon,
          title: errorEmbedTitle,
          titleUrl: errorEmbedTitleUrl,
          requestUrl: errorEmbedRequestUrl,
          method: errorEmbedMethod as HTTPMethods,
          HTTPStatus: errorEmbedHTTPStatus,
          message: errorEmbedMessage,
        }

        if (!errorEmbedRequestUrl) setErrorFormRequestUrlError(dict.errors.dashboard.form.error.REQUEST_URL_REQUIRED);
        if (!errorEmbedMethod) setErrorFormMethodError(dict.errors.dashboard.form.error.HTTP_METHOD_REQUIRED);
        if (!errorEmbedHTTPStatus) setErrorFormHTTPStatusError(dict.errors.dashboard.form.error.HTTP_STATUS_REQUIRED);
        if (!errorEmbedMessage) setErrorFormMessageError(dict.errors.dashboard.form.error.ERROR_MESSAGE_REQUIRED);

        if (!errorEmbedRequestUrl || !errorEmbedMethod || !errorEmbedHTTPStatus || !errorEmbedMessage) return;

        await sendError(errorsFormData)

        resetErrorForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`${dict.errors.dashboard.form.ERROR_SENDING_MESSAGE_TO_DISCORD}: ${message}`);
      }
    } else if (messageType === "announcement") {
      try {
        const announcementsFormData = {
          username: announcementWebhookUsername,
          avatar_url: announcementWebhookUsernameIcon,
          title: announcementTitle,
          announcementMentionTag: announcementMentionTag,
          message: announcementMessage,
          footer: announcementFooter,
          footerRoleTag: announcementFooterRoleTag,
          footerEmojiTag: selectedFooterEmojiTag ? selectedFooterEmojiTag?.emoji_name + selectedFooterEmojiTag?.emoji_id : null,
        }

        if (!announcementMentionTag) setAnnouncementFormMentionTagError(dict.errors.dashboard.form.announcement.MENTION_TAG_REQUIRED);
        if (!announcementTitle) setAnnouncementFormTitleError(dict.errors.dashboard.form.announcement.TITLE_REQUIRED);
        if (!announcementFooter) setAnnouncementFormFooterError(dict.errors.dashboard.form.announcement.FOOTER_MESSAGE_REQUIRED);
        if (!announcementMessage) setAnnouncementFormMessageError(dict.errors.dashboard.form.announcement.ANNOUNCEMENT_MESSAGE_REQUIRED);

        if (!announcementMentionTag || !announcementTitle || !announcementFooter || !announcementMessage) return;

        await sendAnnouncement(announcementsFormData);

        resetAnnouncementForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`${dict.errors.dashboard.form.ERROR_SENDING_MESSAGE_TO_DISCORD}: ${message}`);
      }
    } else {
      try {
        const embedFormData = {
          username: embedWebhookUsername,
          avatar_url: embedWebhookUsernameIcon,
          author: embedAuthor,
          authorIcon: embedAuthorIcon,
          title: embedTitle,
          titleUrl: embedTitleUrl,
          message: embedMessage,
        }

        if (!embedMessage) {
          setEmbedFormMessageError(dict.errors.dashboard.form.embed.EMBED_MESSAGE_REQUIRED);
          return;
        }

        await sendEmbed(embedFormData);

        resetEmbedForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`${dict.errors.dashboard.form.ERROR_SENDING_MESSAGE_TO_DISCORD}: ${message}`);
      }
    }
  }

  function handleMessageTypeSelect(type: "embed" | "error" | "announcement") {
    setMessageType(type);
    clearFeedback();
    resetEmbedForm();
    resetErrorForm();
    resetAnnouncementForm();
  }

  function resetEmbedForm() {
    setFormError(null);
    setEmbedFormMessageError(null);
    setEmbedWebhookUsername('');
    setEmbedWebhookUsernameIcon('');
    setEmbedAuthor('');
    setEmbedAuthorIcon('');
    setEmbedTitle('');
    setEmbedTitleUrl('');
    setEmbedMessage('');
  }

  function resetErrorForm() {
    setFormError(null);
    setErrorFormHTTPStatusError(null);
    setErrorFormMessageError(null);
    setErrorFormMethodError(null);
    setErrorFormRequestUrlError(null);
    setErrorWebhookUsername('');
    setErrorWebhookUsernameIcon('');
    setErrorEmbedAuthor('');
    setErrorEmbedAuthorIcon('');
    setErrorEmbedTitle('');
    setErrorEmbedTitleUrl('');
    setErrorEmbedRequestUrl('');
    setErrorEmbedMethod('');
    setErrorEmbedHTTPStatus('');
    setErrorEmbedMessage('');
  }

  function resetAnnouncementForm() {
    setFormError(null);
    setAnnouncementFormFooterError(null);
    setAnnouncementFormMentionTagError(null);
    setAnnouncementFormMessageError(null);
    setAnnouncementFormTitleError(null);
    setAnnouncementWebhookUsername('');
    setAnnouncementWebhookUsernameIcon('');
    setAnnouncementTitle('');
    setAnnouncementMentionTag('');
    setAnnouncementFooter('');
    setAnnouncementFooterRoleTag('');
    setAnnouncementFooterEmojiTag('');
    setAnnouncementMessage('');
  }

  if (error?.success === false && status === 403) {
    return (
      <div className="text-danger text-center d-flex align-items-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error.message}</div>
    )
  }

  const statusNumber = Number(errorEmbedHTTPStatus);

  const mentionTag = selectedAnnouncementMentionTag?.divider ? 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ' + selectedAnnouncementMentionTag.label + 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ' : selectedAnnouncementMentionTag?.label;
  const footerTag = selectedFooterRoleTag?.divider ? 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ' + selectedFooterRoleTag.label + 'ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ' : selectedFooterRoleTag?.label;

  const tooltip = (
    <Tooltip id="tooltip">
      {formatDiscordTimestampTag(`<t:${Math.floor(Date.now() / 1000)}:F>`, 'en')}
    </Tooltip>
  );

  const selectedMessageType = messageType === 'error' ? dashboardDict.formCard.buttonGroup.error : messageType === 'announcement' ? dashboardDict.formCard.buttonGroup.announcement : messageType === 'embed' && dashboardDict.formCard.buttonGroup.embed;

  return (
    <Container className="p-3 p-md-4 d-flex flex-column row-gap-3 row-gap-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">{dashboardDict.formCard.title}</Card.Title>

          <Dropdown as={ButtonGroup} className="message-type-dropdown" onToggle={(nextShow) => setIsTypeDropdownOpen(Boolean(nextShow))}>
            <BSButton variant="primary" className="text-light rounded-start-1 fw-semibold">{selectedMessageType || dashboardDict.formCard.buttonGroup.placeholder}</BSButton>
            
            <Dropdown.Toggle split variant="primary" className="px-2 d-flex align-items-center text-light" id="dropdown-split-basic">
              <span className={`ms-1 chevron-rotate-180 ${isTypeDropdownOpen ? 'is-open' : ''}`}>
                <FaAngleDown />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
              <Dropdown.Item onClick={() => handleMessageTypeSelect("embed")} className="py-1 px-3">{dashboardDict.formCard.buttonGroup.embed}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleMessageTypeSelect("error")} className="py-1 px-3">{dashboardDict.formCard.buttonGroup.error}</Dropdown.Item>
              <Dropdown.Item onClick={() => handleMessageTypeSelect("announcement")} className="py-1 px-3">{dashboardDict.formCard.buttonGroup.announcement}</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>

        <Card.Body className="p-3 p-md-4">
          <p className="text-gray mb-3 text-center">{dict.contact.form.required}</p>
          {loading && <Loader dict={dict} />}
          
          {messageType === "error" ? (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorUsername">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.username}</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.username}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorWebhookUsername}
                      onChange={(e) => setErrorWebhookUsername(e.target.value)}
                      />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorUsernameIcon">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.icon}</Form.Label>
                    <Form.Control
                      type="text"
                      name="usernameIcon"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.icon}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorWebhookUsernameIcon}
                      onChange={(e) => setErrorWebhookUsernameIcon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorEmbedAuthor">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.embedAuthor}</Form.Label>
                    <Form.Control
                      type="text"
                      name="embedAuthor"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.embedAuthor}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedAuthor}
                      onChange={(e) => setErrorEmbedAuthor(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorEmbedAuthorIcon">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.embedIcon}</Form.Label>
                    <Form.Control
                      type="text"
                      name="embedAuthorIcon"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.embedIcon}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedAuthorIcon}
                      onChange={(e) => setErrorEmbedAuthorIcon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorEmbedTitle">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.embedTitle}</Form.Label>
                    <Form.Control
                      type="text"
                      name="errorEmbedTitle"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.embedTitle}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedTitle}
                      onChange={(e) => setErrorEmbedTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorEmbedTitleUrl">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.embedUrl}</Form.Label>
                    <Form.Control
                      type="text"
                      name="errorEmbedTitleUrl"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.embedUrl}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedTitleUrl}
                      onChange={(e) => setErrorEmbedTitleUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.requestUrl} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.requestUrl}
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedRequestUrl}
                      onChange={(e) => setErrorEmbedRequestUrl(e.target.value)}
                    />
                  </Form.Group>
                  {errorFormRequestUrlError && !error && <Form.Text className="text-danger">{errorFormRequestUrlError}</Form.Text>}
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formMethod">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.httpMethod} <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      value={errorEmbedMethod}
                      onChange={(e) => setErrorEmbedMethod(e.target.value)}
                      className={`rounded-1 border-0 shadow-sm d-flex ${errorEmbedMethod ? 'text-theme' : 'text-placeholder'}`}
                    >
                      <option value="" className="py-1 px-3 text-placeholder" disabled>{dashboardDict.formCard.errorForm.placeholders.httpMethod}</option>
                      {methods.map((m) => (
                        <option key={m.method} value={m.method} className="py-1 px-3">{m.method}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  {errorFormMethodError && !error && <Form.Text className="text-danger">{errorFormMethodError}</Form.Text>}
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formStatus">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.httpStatus} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="formStatus"
                      className="rounded-1 border-0 shadow-sm"
                      placeholder={dashboardDict.formCard.errorForm.placeholders.httpStatus}
                      value={errorEmbedHTTPStatus}
                      onChange={(e) => setErrorEmbedHTTPStatus(e.target.value)}
                    />
                  </Form.Group>
                  {errorFormHTTPStatusError && !error && <Form.Text className="text-danger">{errorFormHTTPStatusError}</Form.Text>}
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="formMessage">
                  <Form.Label className="fw-bold">{dashboardDict.formCard.errorForm.message} <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    placeholder={dashboardDict.formCard.errorForm.placeholders.message}
                    rows={5}
                    className="rounded-1 border-0 shadow-sm"
                    value={errorEmbedMessage}
                    onChange={(e) => setErrorEmbedMessage(e.target.value)}
                  />
                </Form.Group>
                {errorFormMessageError && !error && <Form.Text className="text-danger">{errorFormMessageError}</Form.Text>}
                {error && <Form.Text className="text-danger fs-5">{dict.errors.GENERAL_ERROR}: {error.message}</Form.Text>}
                {success && <Form.Text className="text-success fs-5">{success}</Form.Text>}
              </Row>
              <BSButton variant="primary" type="submit">{dashboardDict.formCard.submit}</BSButton>
            </Form>
          ) : messageType === 'announcement' ? (
              <Form onSubmit={handleSubmit} method="post">
                <Row className="mb-3 row-gap-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthor">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.username}</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        placeholder={dashboardDict.formCard.announcementForm.placeholders.username}
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementWebhookUsername}
                        onChange={(e) => setAnnouncementWebhookUsername(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthorIcon">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.icon}</Form.Label>
                      <Form.Control
                        type="text"
                        name="usernameIcon"
                        placeholder={dashboardDict.formCard.announcementForm.placeholders.icon}
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementWebhookUsernameIcon}
                        onChange={(e) => setAnnouncementWebhookUsernameIcon(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3 row-gap-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formTitle">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.title} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder={dashboardDict.formCard.announcementForm.placeholders.title}
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                      />
                    </Form.Group>
                    {announcementFormTitleError && !error && <Form.Text className="text-danger">{announcementFormTitleError}</Form.Text>}
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="announcementTag">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.mentionTag} <span className="text-danger">*</span></Form.Label>
                      <Dropdown className="tag-dropdown" onToggle={(nextShow) => setIsTagDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedAnnouncementMentionTag ? selectedAnnouncementMentionTag.color : ''}`}>
                          <span className={selectedAnnouncementMentionTag ? '' : 'text-placeholder'}>{selectedAnnouncementMentionTag ? `@${selectedAnnouncementMentionTag.label}` : dashboardDict.formCard.announcementForm.placeholders.mentionTag}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isTagDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          {announcementMentionTags.map((tag) => (
                            <Dropdown.Item key={tag.role_id} onClick={() => setAnnouncementMentionTag(tag.role_id)} className={`py-1 px-3 ${tag.color}`}>@{tag.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                    {announcementFormMentionTagError && !error && <Form.Text className="text-danger">{announcementFormMentionTagError}</Form.Text>}
                  </Col>
                </Row>
                <Row className="mb-3 row-gap-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formFooter">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.footer} <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        as="textarea"
                        name="title"
                        placeholder={dashboardDict.formCard.announcementForm.placeholders.footer}
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementFooter}
                        onChange={(e) => setAnnouncementFooter(e.target.value)}
                      />
                    </Form.Group>
                    {announcementFormFooterError && !error && <Form.Text className="text-danger">{announcementFormFooterError}</Form.Text>}
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementRole">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.footerRole}</Form.Label>
                      <Dropdown className="role-dropdown" onToggle={(nextShow) => setIsRoleDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedFooterRoleTag ? selectedFooterRoleTag.color : ''}`}>
                          <span className={selectedFooterRoleTag ? 'overflow-hidden' : 'text-placeholder'}>{selectedFooterRoleTag ? `@${selectedFooterRoleTag.label}` : dashboardDict.formCard.announcementForm.placeholders.footerRole}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isRoleDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setAnnouncementFooterRoleTag(null)} className="py-1 px-3 text-theme">{dashboardDict.formCard.announcementForm.noRole}</Dropdown.Item>
                          {announcementFooterRoleTags.map((role) => (
                            <Dropdown.Item key={role.role_id} onClick={() => setAnnouncementFooterRoleTag(role.role_id)} className={`py-1 px-3 ${role.color}`}>@{role.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementEmoji">
                      <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.footerEmoji}</Form.Label>
                      <Dropdown className="emoji-dropdown" onToggle={(nextShow) => setIsEmojiDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedFooterEmojiTag ? 'theme' : ''}`}>
                          {selectedFooterEmojiTag ? (
                            <div className="d-flex align-items-center">
                              <Image src={`https://cdn.discordapp.com/emojis/${selectedFooterEmojiTag.emoji_id}`} alt="" className="" width="24" height="24" />
                              <span className="ms-1 overflow-hidden">{selectedFooterEmojiTag.emoji_name}</span>
                            </div>
                          ) : (
                            <span className="text-placeholder">{dashboardDict.formCard.announcementForm.placeholders.footerEmoji}</span>
                          )}
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isEmojiDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu align={{ md: 'end' }} className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setAnnouncementFooterEmojiTag(null)} className="py-1 px-3 text-theme">{dashboardDict.formCard.announcementForm.noEmoji}</Dropdown.Item>
                          {announcementFooterEmojiTags.map((emoji) => (
                            <Dropdown.Item key={emoji.emoji_id} onClick={() => setAnnouncementFooterEmojiTag(emoji.emoji_id)} className={`py-1 px-3 ${emoji.emoji_name}`}>{emoji.emoji_name}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Form.Group controlId="formMessage">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.announcementForm.message} <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      placeholder={dashboardDict.formCard.announcementForm.placeholders.message}
                      rows={5}
                      className="rounded-1 border-0 shadow-sm"
                      value={announcementMessage}
                      onChange={(e) => setAnnouncementMessage(e.target.value)}
                      onInvalid={(e) => setAnnouncementFormMessageError('Announcement message is required')}
                    />
                  </Form.Group>
                  {announcementFormMessageError && !error && <Form.Text className="text-danger">{announcementFormMessageError}</Form.Text>}
                  {error && <Form.Text className="text-danger fs-5">{dict.errors.GENERAL_ERROR}: {error.message}</Form.Text>}
                  {success && <Form.Text className="text-success fs-5">{success}</Form.Text>}
                </Row>
                <BSButton variant="primary" type="submit">{dashboardDict.formCard.submit}</BSButton>
              </Form>
          ) : (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedUsername">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.username}</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.username}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedWebhookUsername}
                      onChange={(e) => setEmbedWebhookUsername(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedUsernameIcon">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.icon}</Form.Label>
                    <Form.Control
                      type="text"
                      name="usernameIcon"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.icon}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedWebhookUsernameIcon}
                      onChange={(e) => setEmbedWebhookUsernameIcon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedAuthor">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.embedAuthor}</Form.Label>
                    <Form.Control
                      type="text"
                      name="embedAuthor"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.embedAuthor}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedAuthor}
                      onChange={(e) => setEmbedAuthor(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedIcon">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.embedIcon}</Form.Label>
                    <Form.Control
                      type="text"
                      name="embedIcon"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.embedIcon}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedAuthorIcon}
                      onChange={(e) => setEmbedAuthorIcon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 row-gap-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedTitle">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.embedTitle}</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.embedTitle}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedTitle}
                      onChange={(e) => setEmbedTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedTitleUrl">
                    <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.embedUrl}</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder={dashboardDict.formCard.embedForm.placeholders.embedUrl}
                      className="rounded-1 border-0 shadow-sm"
                      value={embedTitleUrl}
                      onChange={(e) => setEmbedTitleUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Form.Group controlId="formMessage">
                  <Form.Label className="fw-bold">{dashboardDict.formCard.embedForm.message} <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    placeholder={dashboardDict.formCard.embedForm.placeholders.message}
                    rows={5}
                    className="rounded-1 border-0 shadow-sm"
                    value={embedMessage}
                    onChange={(e) => setEmbedMessage(e.target.value)}
                  />
                </Form.Group>
                {embedFormMessageError && !error && <Form.Text className="text-danger">{embedFormMessageError}</Form.Text>}
                {error && <Form.Text className="text-danger fs-5">{dict.errors.GENERAL_ERROR}: {error.message}</Form.Text>}
                {success && <Form.Text className="text-success fs-5">{success}</Form.Text>}
              </Row>
              <BSButton variant="primary" type="submit">{dashboardDict.formCard.submit}</BSButton>
            </Form>
          )}
        </Card.Body>
      </Card>
      
      <Card className="rounded-1 border-0 shadow-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">{dashboardDict.previewCard.title}</Card.Title>
        </Card.Header>

        <Card.Body className="p-3 p-md-4">
          {messageType === 'error' ? (
            <>
              <div className="discord-message-error">
                <div className="discord-message-inner d-flex">
                  <div className="discord-author-avatar mx-2 me-md-3 mt-1">
                    <Image src={errorWebhookUsernameIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png'} width={40} height={40} roundedCircle />
                  </div>
                  <div className="discord-message-content">
                    <span className="discord-author-info d-inline-flex align-items-center">
                      <span className="discord-author-username">{errorWebhookUsername || 'PPL Solutions VTC Error Logger'}</span>
                      <Badge bg="discord" className="discord-application-tag small py-1 px-2 ms-1">APP</Badge>
                    </span>

                    <span className="discord-message-timestamp ms-2 text-gray small">
                      {formatDiscordTimestampTag(`<t:${Math.floor(Date.now() / 1000)}:t>`, 'nl')}
                    </span>

                    <div className="discord-message-body">
                      <span className="mention-developer px-1 rounded-1 developer-mention-tag">@🛠️ Developer</span>

                      <div className="discord-embed d-flex mb-2 text-theme text-break">
                        <div className="discord-left-border-error rounded-start" style={{ backgroundColor: `#009a86` }}></div>

                        <div className="discord-embed-root">
                          <div className="discord-embed-wrapper bg-surface d-grid rounded border border-1 border-start-0 rounded-start-0">
                            <div className="discord-embed-grid d-inline-grid pt-2 pe-3 pb-3 ps-3">
                              <div className="discord-embed-author d-flex align-items-center mt-2">
                                <Image src={errorEmbedAuthorIcon || 'https://ppl-solutions.vercel.app/assets/images/team/simpelcity.jpg'} className="me-1" width={24} height={24} roundedCircle />
                                <small className="fw-bold">{errorEmbedAuthor || 'Simpelcity'}</small>
                              </div>

                              <div className="discord-embed-title mt-2 fw-bold">
                                <BSLink variant="discord" href={errorEmbedTitleUrl || 'https://ppl-solutions.vercel.app/drivershub/dashboard'} target="_blank" classes="fw-bold">{errorEmbedTitle || 'New Dashboard Error'}</BSLink>
                              </div>

                              <div className="discord-embed-description mt-2 d-flex flex-column">
                                <OverlayTrigger placement="top" overlay={tooltip}>
                                  <strong className={`${resolvedTheme === 'dark' ? 'bg-surface-lighter' : 'bg-surface-darker'} px-1 rounded-1`}>{formatDiscordTimestampTag(`<t:${Math.floor(Date.now() / 1000)}:F>`, 'en')}</strong>
                                </OverlayTrigger>

                                <div className="">
                                  <span>URL:</span>{" "}
                                  <BSLink variant="discord" href={errorEmbedRequestUrl} target="_blank">
                                    {errorEmbedRequestUrl}
                                  </BSLink>
                                </div>

                                <span>Method: {errorEmbedMethod}</span>

                                <span>Status: {errorEmbedHTTPStatus}</span>

                                <span>Error: {statusToErrorName[statusNumber]}</span>

                                <div>
                                  <span>Message:</span>{" "}
                                  {errorEmbedMessage.split("\\n").map((line, i) => (
                                    <span key={i}>
                                      {line}
                                      <br />
                                    </span>
                                  ))}
                                </div>
                                -----------------------------
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </>
          ) : messageType === 'announcement' ? (
            <div className="discord-message-announcement py-1 rounded-end text-break">
              <div className="discord-message-inner d-flex">
                <div className="discord-author-avatar mx-2 mt-1">
                  <Image src={embedWebhookUsernameIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png'} width={40} height={40} roundedCircle />
                </div>
                <div className="discord-message-content">
                  <span className="discord-author-info d-inline-flex align-items-center">
                    <span className="discord-author-username small">{announcementWebhookUsername || 'PPL Solutions VTC'}</span>
                    <Badge bg="discord" className="discord-application-tag small py-1 px-2 ms-1">APP</Badge>
                  </span>

                  <span className="discord-message-timestamp ms-2 text-gray small">
                    {formatDiscordTimestampTag(`<t:${Math.floor(Date.now() / 1000)}:t>`, 'nl')}
                  </span>

                  <div className="discord-message-body d-flex flex-column">
                    {announcementTitle && (
                      <h1 className="">{announcementTitle}</h1>
                    )}

                    {selectedAnnouncementMentionTag && (
                      <>
                        <div className="d-inline-block">
                          <span className="">Greetings</span>{" "}
                          <span className={`px-1 rounded-1 announcement-mention-tag mention-${selectedAnnouncementMentionTag.color}`}>{`@${mentionTag}`}</span>
                          <Image src={`https://cdn.discordapp.com/emojis/1288523924094845030`} width={27} height={27} />
                        </div><br />
                      </>
                    )}
                    
                    {announcementMessage && (
                      <>
                        {announcementMessage.split('\\n').map((line, i) => (
                          <span key={i} className="announcement-message">
                            <Markdown>{line}</Markdown>
                            <br />
                          </span>
                        ))}
                      </>
                    )}
                    
                    <div className="d-flex flex-column">
                      {announcementFooter && (
                        <span className="">{announcementFooter}</span>
                      )}
                      
                      <div className="">
                        {selectedFooterRoleTag && (
                          <span className={`announcement-footer-role-tag mention-${selectedFooterRoleTag?.color} px-1 rounded-1`}>{`@${footerTag}`}</span>
                        )}
                        
                        {selectedFooterEmojiTag && (
                          <Image src={`https://cdn.discordapp.com/emojis/${selectedFooterEmojiTag?.emoji_id}`} width={27} height={27} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="discord-message-embed">
              <div className="discord-message-inner d-flex">
                <div className="discord-author-avatar mx-2 me-md-3 mt-1">
                  <Image src={embedWebhookUsernameIcon || 'https://ppl-solutions.vercel.app/assets/images/dark/logo.png'} width={40} height={40} roundedCircle />
                </div>
                <div className="discord-message-content">
                  <span className="discord-author-info d-inline-flex align-items-center">
                    <span className="discord-author-username">{embedWebhookUsername || 'PPL Solutions VTC'}</span>
                    <Badge bg="discord" className="discord-application-tag small py-1 px-2 ms-1">APP</Badge>
                  </span>

                  <span className="discord-message-timestamp ms-2 text-gray small">
                    {formatDiscordTimestampTag(`<t:${Math.floor(Date.now() / 1000)}:t>`, 'nl')}
                  </span>

                  <div className="discord-embed d-flex my-2 text-theme my-2">
                    <div className="discord-left-border rounded-start" style={{ backgroundColor: `#009a86` }}></div>

                    <div className="discord-embed-root d-grid">
                      <div className="discord-embed-wrapper bg-surface d-grid rounded-1 border border-1  border-start-0 rounded-start-0">
                        <div className="discord-embed-grid d-inline-grid pt-2 pe-3 pb-3 ps-3">
                          <div className="discord-embed-author d-flex align-items-center mt-2">
                            <Image src={embedAuthorIcon || 'https://ppl-solutions.vercel.app/assets/images/team/simpelcity.jpg'} className="me-1" width={24} height={24} roundedCircle />
                            <small className="fw-bold">{embedAuthor || 'Simpelcity'}</small>
                          </div>

                          <div className="discord-embed-title mt-2 fw-bold">
                            <BSLink variant="discord" href={embedTitleUrl || 'https://ppl-solutions.vercel.app/drivershub/dashboard'} target="_blank" classes="fw-bold">{embedTitle || 'New Dashboard Message'}</BSLink>
                          </div>

                          {embedMessage && (
                            <div className="discord-embed-description mt-2 d-flex flex-column">
                              {embedMessage.split("\\n").map((line, i) => (
                                <span key={i}>
                                  {line}
                                  <br />
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
