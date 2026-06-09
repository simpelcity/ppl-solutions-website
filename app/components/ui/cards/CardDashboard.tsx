'use client'

import { Container, Card, Form, Row, Col, Dropdown, ButtonGroup, Image } from 'react-bootstrap'
import type { Dictionary } from "@/app/i18n"
import useDashboard from "@/hooks/useDashboard";
import { useState } from "react";
import { BSButton, ComingSoon } from "@/components";
import { FaAngleDown } from "react-icons/fa6";
import { useTheme } from 'next-themes'
import { type Locale } from '@/i18n'
import '@/styles/ui/Roles.scss'
import Markdown from 'react-markdown'
import ReactMarkdown from 'react-markdown'

type Props = {
  dict: Dictionary;
  lang: Locale;
}

type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export default function CardDashboard({ dict, lang }: Props) {
  const { data, loading, error, status, markdownPreview, sendAnnouncement, sendError, sendEmbed, clearFeedback } = useDashboard();
  const { resolvedTheme } = useTheme();

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
  const [formSuccess, setFormSuccess] = useState<string | null>(null);


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
    { label: '🜲 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '♛Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '👑Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '👑Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: 'Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', color: 'theme', role_id: '1285559909060182026' },
    { label: 'Human Resources Director👥', color: 'hrd', role_id: '1282300994046394498' },
    { label: 'Human Resources👥', color: 'hr', role_id: '1282090397828382802' },
    { label: 'Recruitment Team Director📋', color: 'rtd', role_id: '1282301484788092979' },
    { label: 'Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: 'Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: 'Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', color: 'theme', role_id: '1285585227091279883' },
    { label: 'Recruitment Team📋', color: 'rt', role_id: '1282091153910661170' },
    { label: 'Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: 'Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: 'Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: 'Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', color: 'theme', role_id: '1285560716085952623' },
    { label: 'Driver🚚', color: 'driver', role_id: '1282026105238327317' },
    { label: 'Member👤', color: 'member', role_id: '1282224309741293610' },
    { label: 'News Ping', color: 'ping', role_id: '1285587879896027187' },
    { label: 'everyone', color: 'theme', role_id: 'everyone' },
  ];

  const announcementFooterRoleTags = [
    { label: '🜲 Founder', color: 'founder', role_id: '1282025660730310676' },
    { label: '♛Chief Executive Officer', color: 'ceo', role_id: '1282025846676127785' },
    { label: '👑Chief Administrative Officer', color: 'cao', role_id: '1282300248533897227' },
    { label: '👑Chief Operating Officer', color: 'coo', role_id: '1282300202753069117' },
    { label: 'Community Manager', color: 'cm', role_id: '1282247458675757086' },
    { label: 'Management', color: 'theme', role_id: '1285559909060182026' },
    { label: 'Human Resources Director👥', color: 'hrd', role_id: '1282300994046394498' },
    { label: 'Human Resources👥', color: 'hr', role_id: '1282090397828382802' },
    { label: 'Recruitment Team Director📋', color: 'rtd', role_id: '1282301484788092979' },
    { label: 'Event Team Manager', color: 'etm', role_id: '1282301578312941588' },
    { label: 'Media Team Manager', color: 'mtm', role_id: '1282301155598405674' },
    { label: 'Convoy Control Manager', color: 'ccm', role_id: '1282301688266358795' },
    { label: 'Upper Staff', color: 'theme', role_id: '1285585227091279883' },
    { label: 'Recruitment Team📋', color: 'rt', role_id: '1282091153910661170' },
    { label: 'Event Team', color: 'et', role_id: '1282301640589705226' },
    { label: 'Media Team', color: 'mt', role_id: '1282301423413104701' },
    { label: 'Convoy Control', color: 'cc', role_id: '1282301801080815636' },
    { label: 'Staff Team', color: 'staff', role_id: '1282090713751883857' },
    { label: 'Lower Staff', color: 'theme', role_id: '1285560716085952623' },
  ];

  const announcementFooterEmojiTags = [
    { emoji_name: ':ppls_logo:', emoji_id: '1513842708316426311' },
    { emoji_name: ':peepo_ppls:', emoji_id: '1288526719992725577' },
    { emoji_name: ':Scania:', emoji_id: '1513844409765199942' },
    { emoji_name: ':peepo_love:', emoji_id: '1288523924094845030' },
    { emoji_name: ':ets2:', emoji_id: '1283513953439322132' },
  ];

  const selectedAnnouncementMentionTag = announcementMentionTags.find((tag) => tag.role_id === announcementMentionTag);
  const selectedFooterRoleTag = announcementFooterRoleTags.find((role) => role.role_id === announcementFooterRoleTag);
  const selectedFooterEmojiTag = announcementFooterEmojiTags.find((emoji) => emoji.emoji_id === announcementFooterEmojiTag);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // if (!messageType) return null;
    
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

        await sendError(errorsFormData)

        resetErrorForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
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
          footerEmojiTag: announcementFooterEmojiTag,
        }

        await sendAnnouncement(announcementsFormData);

        resetAnnouncementForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
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

        await sendEmbed(embedFormData);

        resetEmbedForm();
      } catch (err: any) {
        const message = err?.message;
        setFormError(`Error sending message to Discord: ${message}`);
      }
    }
  }

  function handleMessageTypeSelect(type: "embed" | "error" | "announcement") {
    setMessageType(type);
    clearFeedback();
  }

  function resetEmbedForm() {
    setFormError(null);
  }

  function resetErrorForm() {
    setFormError(null);
  }

  function resetAnnouncementForm() {
    setFormError(null);
  }

  // console.log(markdownPreview)
  // const jsonData = typeof markdownPreview?.config?.data === 'string' ? JSON.parse(markdownPreview.config.data) : null;
  // console.log(jsonData)
  // const embedData = jsonData?.embeds && Array.isArray(jsonData.embeds) && jsonData.embeds.length > 0 ? jsonData.embeds[0] : null;
  // const roleIdRegex = /<@&(\d+)>/g;
  // const roleIdsInContent = [];
  // let match;
  // if (jsonData?.content) {
  //   while ((match = roleIdRegex.exec(jsonData.content)) !== null) {
  //     roleIdsInContent.push(match[1]);
  //   }
  // }
  // console.log('Extracted role IDs from content:', roleIdsInContent);
  console.log()

  if (error?.success === false && status === 403) {
    return (
      <div className="text-danger text-center d-flex align-items-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error.message}</div>
    )
  }

  return (
    <Container className="p-3 p-md-4 d-flex flex-column row-gap-3 row-gap-md-4" fluid>
      <Card className="rounded-1 border-0 shadow-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface d-flex justify-content-between align-items-center p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">Dashboard</Card.Title>

          <Dropdown as={ButtonGroup} className="message-type-dropdown" onToggle={(nextShow) => setIsTypeDropdownOpen(Boolean(nextShow))}>
            <BSButton variant="primary" className="text-light rounded-start-1 fw-semibold">{messageType ? messageType.charAt(0).toUpperCase() + messageType.slice(1) : 'Select Message Type'}</BSButton>
            
            <Dropdown.Toggle split variant="primary" className="px-2 d-flex align-items-center text-light" id="dropdown-split-basic">
              <span className={`ms-1 chevron-rotate-180 ${isTypeDropdownOpen ? 'is-open' : ''}`}>
                <FaAngleDown />
              </span>
            </Dropdown.Toggle>

            <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
              <Dropdown.Item onClick={() => handleMessageTypeSelect("embed")} className="py-1 px-3">Embed</Dropdown.Item>
              <Dropdown.Item onClick={() => handleMessageTypeSelect("error")} className="py-1 px-3">Error</Dropdown.Item>
              <Dropdown.Item onClick={() => handleMessageTypeSelect("announcement")} className="py-1 px-3">Announcement</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Card.Header>

        <Card.Body className="p-3 p-md-4">
          {loading && <p>Loading...</p>}
          {data && <p className="text-success">Message sent successfully!</p>}
          {error && <p className="text-danger">Error: {error.message}</p>}
          
          {messageType === "error" ? (
            <Form onSubmit={handleSubmit} method="post">
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="errorUsername">
                    <Form.Label className="fw-bold">Webhook Username</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="PPL Solutions VTC Website Alerts"
                      className="rounded-1 border-0 shadow-sm"
                      value={errorWebhookUsername}
                      onChange={(e) => setErrorWebhookUsername(e.target.value)}
                      />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formUrl">
                    <Form.Label className="fw-bold">Request URL</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/api/endpoint"
                      className="rounded-1 border-0 shadow-sm"
                      value={errorEmbedRequestUrl}
                      onChange={(e) => setErrorEmbedRequestUrl(e.target.value)}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formMethod">
                    <Form.Label className="fw-bold">HTTP Method</Form.Label>
                    <Form.Select
                      value={errorEmbedMethod}
                      onChange={(e) => setErrorEmbedMethod(e.target.value)}
                      className={`rounded-1 border-0 shadow-sm d-flex ${errorEmbedMethod ? 'text-theme' : 'text-placeholder'}`}
                      required
                    >
                      <option value="" className="py-1 px-3 text-placeholder" disabled>Select method</option>
                      {methods.map((m) => (
                        <option key={m.method} value={m.method} className="py-1 px-3">{m.method}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}>
                  <Form.Group controlId="formStatus">
                    <Form.Label className="fw-bold">HTTP Status</Form.Label>
                    <Form.Control
                      type="text"
                      className="rounded-1 border-0 shadow-sm"
                      placeholder="e.g. 200, 404, 500"
                      value={errorEmbedHTTPStatus}
                      onChange={(e) => setErrorEmbedHTTPStatus(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6} xl={4}></Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message</Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={errorEmbedMessage}
                  onChange={(e) => setErrorEmbedMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          ) : messageType === 'announcement' ? (
              <Form onSubmit={handleSubmit} method="post">
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthor">
                      <Form.Label className="fw-bold">Author</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Simpelcity"
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementWebhookUsername}
                        onChange={(e) => setAnnouncementWebhookUsername(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formAuthorIcon">
                      <Form.Label className="fw-bold">Author Icon</Form.Label>
                      <Form.Control
                        type="text"
                        name="url"
                        placeholder="https://example.com/icon.png"
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementWebhookUsernameIcon}
                        onChange={(e) => setAnnouncementWebhookUsernameIcon(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="announcementTag">
                      <Form.Label className="fw-bold">Announcement Tag</Form.Label>
                      <Dropdown className="tag-dropdown" onToggle={(nextShow) => setIsTagDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedAnnouncementMentionTag ? selectedAnnouncementMentionTag.color : ''}`}>
                          <span className={selectedAnnouncementMentionTag ? '' : 'text-placeholder'}>{selectedAnnouncementMentionTag ? `@${selectedAnnouncementMentionTag.label}` : 'Select Tag'}</span>
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
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementRole">
                      <Form.Label className="fw-bold">Footer Role</Form.Label>
                      <Dropdown className="role-dropdown" onToggle={(nextShow) => setIsRoleDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedFooterRoleTag ? selectedFooterRoleTag.color : ''}`}>
                          <span className={selectedFooterRoleTag ? '' : 'text-placeholder'}>{selectedFooterRoleTag ? `@${selectedFooterRoleTag.label}` : 'Select Role'}</span>
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isRoleDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setAnnouncementFooterRoleTag(null)} className="py-1 px-3 text-theme">No Role</Dropdown.Item>
                          {announcementFooterRoleTags.map((role) => (
                            <Dropdown.Item key={role.role_id} onClick={() => setAnnouncementFooterRoleTag(role.role_id)} className={`py-1 px-3 ${role.color}`}>@{role.label}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={3}>
                    <Form.Group controlId="announcementEmoji">
                      <Form.Label className="fw-bold">Footer Emoji</Form.Label>
                      <Dropdown className="emoji-dropdown" onToggle={(nextShow) => setIsEmojiDropdownOpen(Boolean(nextShow))}>
                        <Dropdown.Toggle className={`d-flex align-items-center justify-content-between w-100 rounded-1 border-0 shadow-sm bg-surface-darker fw-semibold ${selectedFooterEmojiTag ? 'theme' : ''}`}>
                          {selectedFooterEmojiTag ? (
                            <div className="d-flex align-items-center">
                              <Image src={`https://cdn.discordapp.com/emojis/${selectedFooterEmojiTag.emoji_id}`} alt="" className="" width="24" height="24" />
                              <span className="ms-1">{selectedFooterEmojiTag.emoji_name}</span>
                            </div>
                          ) : (
                            <span className="text-placeholder">Select Emoji</span>
                          )}
                          <span className={`ms-1 chevron-rotate-180 text-theme ${isEmojiDropdownOpen ? 'is-open' : ''}`}>
                            <FaAngleDown />
                          </span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="rounded-1 border-0 shadow-sm">
                          <Dropdown.Item onClick={() => setAnnouncementFooterEmojiTag(null)} className="py-1 px-3 text-theme">No Emoji</Dropdown.Item>
                          {announcementFooterEmojiTags.map((emoji) => (
                            <Dropdown.Item key={emoji.emoji_id} onClick={() => setAnnouncementFooterEmojiTag(emoji.emoji_id)} className={`py-1 px-3 ${emoji.emoji_name}`}>{emoji.emoji_name}</Dropdown.Item>
                          ))}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formTitle">
                      <Form.Label className="fw-bold">Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Your announcement title"
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementTitle}
                        onChange={(e) => setAnnouncementTitle(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} md={6}>
                    <Form.Group controlId="formFooter">
                      <Form.Label className="fw-bold">Footer</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="title"
                        placeholder="Your announcement footer"
                        className="rounded-1 border-0 shadow-sm"
                        value={announcementFooter}
                        onChange={(e) => setAnnouncementFooter(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="formMessage" className="mb-3">
                  <Form.Label className="fw-bold">Message</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="message"
                    placeholder="Enter your announcement here..."
                    rows={5}
                    className="rounded-1 border-0 shadow-sm"
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    required
                  />
                </Form.Group>
                <BSButton variant="primary" type="submit">Send to Discord</BSButton>
              </Form>
          ) : (
            <Form onSubmit={handleSubmit} method="post">
                  <p className="text-gray mb-3 mb-md-4 text-center">{dict.contact.form.required}</p>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="webhookUsername">
                    <Form.Label className="fw-bold">Webhook Username (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      placeholder="Example Username"
                      className="rounded-1 border-0 shadow-sm"
                      value={embedWebhookUsername}
                      onChange={(e) => setEmbedWebhookUsername(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="webhookUsernameIcon">
                    <Form.Label className="fw-bold">Webhook Username Icon (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="usernameIcon"
                      placeholder="https://example.com/icon.png"
                      className="rounded-1 border-0 shadow-sm"
                      value={embedWebhookUsernameIcon}
                      onChange={(e) => setEmbedWebhookUsernameIcon(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedTitle">
                    <Form.Label className="fw-bold">Embed Title (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      placeholder="New Dashboard Message"
                      className="rounded-1 border-0 shadow-sm"
                      value={embedTitle}
                      onChange={(e) => setEmbedTitle(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="embedTitleUrl">
                    <Form.Label className="fw-bold">Embed URL (optional)</Form.Label>
                    <Form.Control
                      type="text"
                      name="url"
                      placeholder="https://example.com/dashboard"
                      className="rounded-1 border-0 shadow-sm"
                      value={embedTitleUrl}
                      onChange={(e) => setEmbedTitleUrl(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group controlId="formMessage" className="mb-3">
                <Form.Label className="fw-bold">Message <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  as="textarea"
                  name="message"
                  placeholder="Enter your message here..."
                  rows={5}
                  className="rounded-1 border-0 shadow-sm"
                  value={embedMessage}
                  onChange={(e) => setEmbedMessage(e.target.value)}
                  required
                />
              </Form.Group>
              <BSButton variant="primary" type="submit">Send to Discord</BSButton>
            </Form>
          )}
        </Card.Body>
      </Card>

      <Card className="rounded-1 border-0 shadow-sm px-0 bg-surface text-theme">
        <Card.Header className="bg-surface p-3 p-md-4 border-bottom">
          <Card.Title className="fs-3 m-0">Preview</Card.Title>
        </Card.Header>

        <Card.Body className="p-3 p-md-4">
          {messageType === 'announcement' && (
            <Markdown>
              {`**${embedTitle}**\n\n${embedMessage}`}
            </Markdown>
          )}
          <div className="discord-embed d-flex my-2 text-theme">
            <div className="discord-left-border" style={{ backgroundColor: `#009a86` }}></div>
            <div className="discord-embed-root d-grid">
              <div className="discord-embed-wrapper bg-surface-darker d-grid">
                <div className="discord-embed-grid d-inline-grid pt-2 pe-3 pb-3 ps-3">
                  <div className="discord-embed-title mt-2 fw-bold">
                    <span>{announcementTitle}</span>
                  </div>

                  <div className="discord-embed-description mt-2">
                    {announcementMessage.split("\\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}
